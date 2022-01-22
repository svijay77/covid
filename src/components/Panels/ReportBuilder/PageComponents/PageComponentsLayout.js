import styled from "styled-components";
import {Icon} from "../../../../components";

export const PanelItemContainer = styled.div`
  border: 1px solid rgba(0, 0, 0, 0);
  position: relative;
  padding: 0.25em;
  overflow: hidden;
  *.hover-buttons {
    opacity: 0.1;
    transition: 250ms opacity;
  }
  &:hover {
    border: 1px solid black;
    *.hover-buttons {
      opacity: 1;
      background: white;
    }
  }
  &.w1 {
    width: 24.5%;
  }
  &.w2 {
    width: 49.5%;
  }
  &.w3 {
    width: 74.5%;
  }
  &.w4 {
    width: 100%;
  }
  &.h1 {
    height: 10em;
  }
  &.h2 {
    height: 20em;
  }
  &.h3 {
    height: 30em;
  }
  &.h4 {
    height: 40em;
  }
  &.h5 {
    height: 50em;
  }
  &.h6 {
    height: 60em;
  }
  &.hauto {
    height: auto;
  }
`;

export const widthOptions = {
  type: "select",
  content: {
    label: "Set Width",
    items: [
      {
        label: "1/4",
        value: 1,
      },
      {
        label: "1/2",
        value: 2,
      },
      {
        label: "3/4",
        value: 3,
      },
      {
        label: "Full Width",
        value: 4,
      },
    ],
  },
};

export const heightOptions = {
  type: "select",
  content: {
    label: "Set Height",
    items: [
      // {
      //   label: "Auto",
      //   value: "auto",
      // },
      {
        label: "1",
        value: 1,
      },
      {
        label: "2",
        value: 2,
      },
      {
        label: "3",
        value: 3,
      },
      {
        label: "3",
        value: 3,
      },
      {
        label: "4",
        value: 4,
      },
      {
        label: "5",
        value: 5,
      },
      {
        label: "6",
        value: 6,
      },
    ],
  },
};

export const GrabTargetDiv = styled.button`
  position: absolute;
  left: ${(props) => props.left};
  top: ${(props) => props.top};
  width: 2rem;
  height: 2rem;
  padding: 0;
  opacity: 0.5;
  background: none;
  border: none;
  cursor: grabbing;
  span svg g path,
  span svg,
  span svg g {
    fill: ${(props) => props.iconColor};
  }
  &:hover {
    opacity: 1;
  }
`;

export const DeleteBlockDiv = styled(GrabTargetDiv)`
  cursor: pointer;
  padding: 0.4em;
`;

export const GrabTarget = ({ iconColor, className }) => (
  <GrabTargetDiv
    left="2em"
    top="0px"
    className={`content-header ${className}`}
    iconColor={iconColor}
    title="Move this content"
  >
    <Icon symbol="drag" />
  </GrabTargetDiv>
);

export const DeleteBlock = ({ iconColor, className, onClick }) => (
  <DeleteBlockDiv
    left="4em"
    top="0px"
    className={className}
    iconColor={iconColor}
    title="Remove Block"
    onClick={onClick}
  >
    <Icon symbol="remove" />
  </DeleteBlockDiv>
);
