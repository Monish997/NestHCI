import React, { createContext, useContext } from "react";
import { Text as RNText, View as RNView } from "react-native";

// Create a context to keep track of the depth
const DepthContext = createContext(0);

const DEBUG = false;

const colors = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "cyan",
  "pink",
  "yellow",
  "teal",
  "brown",
];

const getBorderColor = (depth: number) => {
  return colors[depth % colors.length];
};

// Create a custom Text component
const Text: React.FC<React.ComponentProps<typeof RNText>> = (props) => {
  const depth = useContext(DepthContext);
  const style = DEBUG ? { borderColor: getBorderColor(depth), borderWidth: 1 } : {};

  return (
    <DepthContext.Provider value={depth + 1}>
      <RNText {...props} style={[style, props.style]} />
    </DepthContext.Provider>
  );
};

// Create a custom View component
const View: React.FC<React.ComponentProps<typeof RNView>> = (props) => {
  const depth = useContext(DepthContext);
  const style = DEBUG ? { borderColor: getBorderColor(depth), borderWidth: 1 } : {};

  return (
    <DepthContext.Provider value={depth + 1}>
      <RNView {...props} style={[style, props.style]} />
    </DepthContext.Provider>
  );
};

export { Text, View };
