import type { IGardenTheme } from "@zendeskgarden/react-theming";
import "styled-components";

interface IRemSpace {
  remSpace: {
    base: number;
    xxs: string;
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
  };
}

declare module "styled-components" {
  export interface DefaultTheme extends IGardenTheme, IRemSpace {}
}