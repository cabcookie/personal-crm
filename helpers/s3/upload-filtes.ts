import {
  downloadData,
  getUrl,
  TransferProgressEvent,
  uploadData,
} from "aws-amplify/storage";

const getSignedS3Url = async (path: string) => {
  const { url, expiresAt } = await getUrl({ path });
  return { url, expiresAt, s3Path: path };
};

const percentLoaded = (event: TransferProgressEvent) =>
  Math.floor((event.transferredBytes / (event.totalBytes || 30000)) * 100);

const uploadFileToS3 = async (file: File, path: string) => {
  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const s3FileKey = await uploadData({
    path: ({ identityId }) =>
      path
        .replace("${identityId}", identityId ?? "")
        .replace("${filename}", fileName),
    data: file,
    options: {
      contentType: file.type,
    },
  }).result;

  return await getSignedS3Url(s3FileKey.path);
};

const downloadDataFromS3 = async (
  path: string,
  onProgress?: (event: TransferProgressEvent) => void
) => {
  return await downloadData({ path, options: { onProgress } });
};

export { downloadDataFromS3, getSignedS3Url, percentLoaded, uploadFileToS3 };
