import * as React from 'react';
import { ViewProps, TextProps } from 'react-native';

declare module 'react-native' {
  interface View extends React.Component<ViewProps> {}
  interface Text extends React.Component<TextProps> {}
}
