import { open, type FileHandle } from "fs/promises";
import { crc32, deflateRawSync } from "zlib";

/**
 * Minimal ZIP writer (PKWARE APPNOTE, no ZIP64) that appends entries to a file
 * on disk, so the archive never has to fit into memory. Written in-house to
 * avoid a new dependency for a one-off export. Limits: < 4 GiB archive and
 * < 65,535 entries — exceeding them throws instead of writing a corrupt file.
 */

const MAX_U32 = 0xffffffff;
const MAX_ENTRIES = 0xffff;
const FLAG_UTF8 = 0x0800;
const METHOD_STORE = 0;
const METHOD_DEFLATE = 8;
const VERSION = 20;

type CentralEntry = {
  name: Buffer;
  method: number;
  crc: number;
  compressedSize: number;
  size: number;
  offset: number;
  time: number;
  date: number;
};

const dosDateTime = (d: Date) => ({
  time: (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1),
  date:
    ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate(),
});

export class ZipFileWriter {
  private entries: CentralEntry[] = [];
  private offset = 0;

  private constructor(private file: FileHandle) {}

  static async create(path: string): Promise<ZipFileWriter> {
    return new ZipFileWriter(await open(path, "w"));
  }

  private async write(buf: Buffer): Promise<void> {
    if (this.offset + buf.length > MAX_U32)
      throw new Error("ZIP archive would exceed 4 GiB (no ZIP64 support)");
    await this.file.write(buf, 0, buf.length, this.offset);
    this.offset += buf.length;
  }

  /** `compress: false` for already compressed content such as images. */
  async add(
    entryName: string,
    data: Buffer,
    { compress = true, modified = new Date() } = {}
  ): Promise<void> {
    if (this.entries.length >= MAX_ENTRIES)
      throw new Error("ZIP archive would exceed 65,535 entries");
    const name = Buffer.from(entryName, "utf8");
    const deflated = compress ? deflateRawSync(data) : null;
    const useDeflate = !!deflated && deflated.length < data.length;
    const body = useDeflate ? deflated! : data;
    const { time, date } = dosDateTime(modified);
    const entry: CentralEntry = {
      name,
      method: useDeflate ? METHOD_DEFLATE : METHOD_STORE,
      crc: crc32(data) >>> 0,
      compressedSize: body.length,
      size: data.length,
      offset: this.offset,
      time,
      date,
    };
    const header = Buffer.alloc(30);
    header.writeUInt32LE(0x04034b50, 0);
    header.writeUInt16LE(VERSION, 4);
    header.writeUInt16LE(FLAG_UTF8, 6);
    header.writeUInt16LE(entry.method, 8);
    header.writeUInt16LE(time, 10);
    header.writeUInt16LE(date, 12);
    header.writeUInt32LE(entry.crc, 14);
    header.writeUInt32LE(entry.compressedSize, 18);
    header.writeUInt32LE(entry.size, 22);
    header.writeUInt16LE(name.length, 26);
    header.writeUInt16LE(0, 28);
    await this.write(Buffer.concat([header, name]));
    await this.write(body);
    this.entries.push(entry);
  }

  /** Writes the central directory and closes the file. */
  async finish(): Promise<void> {
    const start = this.offset;
    for (const e of this.entries) {
      const header = Buffer.alloc(46);
      header.writeUInt32LE(0x02014b50, 0);
      header.writeUInt16LE(VERSION, 4);
      header.writeUInt16LE(VERSION, 6);
      header.writeUInt16LE(FLAG_UTF8, 8);
      header.writeUInt16LE(e.method, 10);
      header.writeUInt16LE(e.time, 12);
      header.writeUInt16LE(e.date, 14);
      header.writeUInt32LE(e.crc, 16);
      header.writeUInt32LE(e.compressedSize, 20);
      header.writeUInt32LE(e.size, 24);
      header.writeUInt16LE(e.name.length, 28);
      // extra length, comment length, disk number, internal + external
      // attributes stay 0.
      header.writeUInt32LE(e.offset, 42);
      await this.write(Buffer.concat([header, e.name]));
    }
    const end = Buffer.alloc(22);
    end.writeUInt32LE(0x06054b50, 0);
    end.writeUInt16LE(this.entries.length, 8);
    end.writeUInt16LE(this.entries.length, 10);
    end.writeUInt32LE(this.offset - start, 12);
    end.writeUInt32LE(start, 16);
    await this.write(end);
    await this.file.close();
  }
}
