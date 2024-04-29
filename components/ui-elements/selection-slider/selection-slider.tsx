import {
  CSSProperties,
  FC,
  MutableRefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "./SelectionSlider.module.css";

const moveSlider = (
  setHighlighterStyle: (style: CSSProperties) => void,
  sliderRef: MutableRefObject<HTMLDivElement[]>,
  valueList: string[],
  btnColor: string,
  value?: string
) => {
  const activeIndex = valueList.findIndex((c) => c === value);
  const activeElement = sliderRef.current[activeIndex];

  if (activeElement) {
    const { offsetWidth: width, offsetLeft: left } = activeElement;
    const innerOffset = sliderRef.current[0].offsetLeft + 2;
    setHighlighterStyle({
      width: `${width + innerOffset * 2}px`,
      transform: `translateX(${left - innerOffset}px)`,
      backgroundColor: btnColor,
    });
  }
};

type SelectionSliderProps = {
  valueList: any[];
  value: any;
  onChange: (val: any) => void;
  btnColor?: string;
};

const SelectionSlider: FC<SelectionSliderProps> = ({
  valueList,
  value,
  onChange,
  btnColor,
}) => {
  const [highlighterStyle, setHighlighterStyle] = useState({});
  const sliderRef = useRef<HTMLDivElement[]>([]);

  useEffect(
    () =>
      moveSlider(
        setHighlighterStyle,
        sliderRef,
        valueList,
        btnColor || "gray",
        value
      ),
    [value, valueList, btnColor]
  );

  useEffect(() => {
    const listener = () =>
      moveSlider(
        setHighlighterStyle,
        sliderRef,
        valueList,
        btnColor || "gray",
        value
      );
    window.addEventListener("resize", listener);
    return () => window.removeEventListener("resize", listener);
  }, [value, valueList, btnColor]);

  return (
    <button className={styles.switcher}>
      <div className={styles.highlighter} style={highlighterStyle} />
      {valueList.map((val, idx) => (
        <div
          key={idx}
          ref={(el) => {
            if (el) sliderRef.current[idx] = el;
          }}
          className={`${styles.value} ${val === value ? styles.isActive : ""}`}
          style={
            {
              "--value-color": `var(--${val}-color-text-secondary)`,
              "--value-color-hover": `var(--${val}-color-btn)`,
            } as CSSProperties
          }
          onClick={() => onChange(val)}
        >
          {val}
        </div>
      ))}
    </button>
  );
};

export default SelectionSlider;
