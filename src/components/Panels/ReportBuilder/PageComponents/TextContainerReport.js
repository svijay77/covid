import { ControlPopover } from "../../../../components";
import {
  PanelItemContainer,
  GrabTarget,
  DeleteBlock,
  widthOptions,
  heightOptions,
} from "./PageComponentsLayout";
import colors from "../../../../config/colors";

const TextComponentMapping = {
  '7day': ({name}) => <h2>7-Day Average Report: {name}</h2>,
  'regional': ({name}) => <h2>Regional Snapshot: {name}</h2>,
  'neighbors': ({name}) => <h2>Neighbor Comparison: {name}</h2>,
  'national': () => <h2>National Overview</h2>
}
export const TextContainerReport = ({
  geoid = null,
  pageIdx = 0,
  contentIdx = 0,
  handleChange,
  handleRemove,
  width,
  height,
  content,
  name,
}) => {
  
  const InnerComponent = typeof content === "string" ? () => <h2>{content}</h2> : TextComponentMapping[content?.preset];
  
  return (
    <PanelItemContainer className={`w${width || 4} h${height || 1}`}>
      <InnerComponent name={name} />
      <ControlPopover
        top="0"
        left="0"
        className="hover-buttons"
        iconColor={colors.strongOrange}
        controlElements={[
          {
            type: "header",
            content: "Controls for Table Report Block",
          },
          {
            type: "helperText",
            content: "Select the data to display on the chart.",
          },
          {
            ...widthOptions,
            action: (e) =>
              handleChange(pageIdx, contentIdx, { width: e.target.value }),
            value: width,
          },
          {
            ...heightOptions,
            action: (e) =>
              handleChange(pageIdx, contentIdx, { height: e.target.value }),
            value: height,
          },
        ]}
      />
      <GrabTarget iconColor={colors.strongOrange} className="hover-buttons" />
      <DeleteBlock
        iconColor={colors.strongOrange}
        className="hover-buttons"
        onClick={() => handleRemove(pageIdx, contentIdx)}
      />
    </PanelItemContainer>
  );
};
