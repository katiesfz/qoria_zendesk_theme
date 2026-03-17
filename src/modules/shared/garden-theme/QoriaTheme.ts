import type { IButtonProps } from "@zendeskgarden/react-buttons";
import type { IGardenTheme } from "@zendeskgarden/react-theming";
import { DEFAULT_THEME, getColor, PALETTE } from "@zendeskgarden/react-theming";
import { css } from "styled-components";

export interface Settings {
  background_color: string;
  text_color: string;
  brand_color: string;
  brand_text_color: string;
  link_color: string;
  hover_link_color: string;
  visited_link_color: string;
}

const createAccessibleFormControlStyle = (isWrapper: boolean) => {
  const invalidSelector = isWrapper
    ? ':has(input[aria-invalid="true"])'
    : '[aria-invalid="true"]';

  return css`
    /* Boost default border contrast - use :not() to preserve validation colors */
    &:not(${invalidSelector}) {
      border-color: ${(p) =>
        getColor({
          theme: p.theme,
          variable: "border.default",
          dark: { offset: -100 },
          light: { offset: 300 },
        })};
    }

    /* Enhanced hover state */
    &:hover:not(${invalidSelector}) {
      border-color: ${(p) =>
        getColor({
          theme: p.theme,
          variable: "border.primaryEmphasis",
          dark: { offset: -100 },
          light: { offset: 100 },
        })};
    }
  `;
};

const accessibleFormInputStyle = createAccessibleFormControlStyle(false);
const accessibleFormWrapperStyle = createAccessibleFormControlStyle(true);


const themeSettings = {
    background_color: "#FFFFFF",
    text_color: "#1d1e1c",
    brand_color: "#515ba5",
    brand_text_color: "#1d1e1c",
    link_color: "#515ba5",
    hover_link_color: "#515ba5",
    visited_link_color: "#515ba5"
}

const qoriaPalette = {
    ...PALETTE,
    "black": "#000",
    "white": "#fff",
    "product": {
        "support": "#00a656",
        "explore": "#30aabc",
        "gather": "#f6c8be",
        "guide": "#eb4962",
        "chat": "#f79a3e",
        "talk": "#efc93d",
        "sell": "#c38f00"
    },
    "grey": {
        "100": "#f8f8f8",
        "200": "#f4f4f4",
        "300": "#ebebeb",
        "400": "#cbcbcb",
        "500": "#B0B0B0",
        "600": "#706f6e",
        "700": "#4d4d4d",
        "800": "#323332",
        "900": "#1d1e1c",
        "1000": "#1d1e1c",
        "1100": "#1d1e1c",
        "1200": "#1d1e1c"
    },
    "blue": {
        "100": "#F0F8FB",
        "200": "#D4EAF5",
        "300": "#A9D6EC",
        "400": "#8DC9E6",
        "500": "#7BAFC9",
        "600": "#6996AC",
        "700": "#587D8F",
        "800": "#466473",
        "900": "#344B56",
        "1000": "#233239",
        "1100": "#11191C",
        "1200": "#11191C"
    },
    "red": {
        "100": "#FFEEEE",
        "200": "#FFDADB",
        "300": "#FFC5C6",
        "400": "#FFAFB1",
        "500": "#FF8D93",
        "600": "#EB6571",
        "700": "#C24553",
        "800": "#A23442",
        "900": "#79242F",
        "1000": "#56161E",
        "1100": "#44000E",
        "1200": "#44000E"
    },
    "yellow": {
        "100":  "#FFF2D9",
        "200":  "#FFE9B2",
        "300":  "#FFD86F",
        "400":  "#F5BA00",
        "500":  "#D69F00",
        "600":  "#C18700",
        "700":  "#9C6C00",
        "800":  "#7E5500",
        "900":  "#593C00",
        "1000": "#3E2A00",
        "1100": "#261700",
        "1200": "#261700"
    },
    "green": {
        "100":  "#E8F8EF",
        "200":  "#CEEDDD",
        "300":  "#A4DBC0",
        "400":  "#7ECAA7",
        "500":  "#58B78E",
        "600":  "#3E9F78",
        "700":  "#268460",
        "800":  "#1B6F50",
        "900":  "#00563A",
        "1000": "#084630",
        "1100": "#003925",
        "1200": "#003925"
    },
    "purple": {
        "100":  "#F4F6FF",
        "200":  "#E1E7FF",
        "300":  "#D1D9FD",
        "400":  "#B6C1F5",
        "500":  "#9EABEB",
        "600":  "#7E8AD4",
        "700":  "#6371BB",
        "800":  "#515BA5",
        "900":  "#383F85",
        "1000": "#262A6E",
        "1100": "#110A4E",
        "1200": "#110A4E"
    }
};



export const qoriaTheme = {
    ...DEFAULT_THEME,
    borders: {
        sm: "1px solid",
        md: "3px solid"
    },
    borderRadii: {
        sm: "2px",
        md: "4px",
        lg: "8px"
    },
    borderStyles: {
        solid: "solid"
    },
    borderWidths: {
        sm: "1px",
        md: "3px"
    },
    breakpoints: {
        xs: "0px",
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px"
    },
    colors: {
        base: "light",
        primaryHue: "purple",
        dangerHue: "red",
        warningHue: "yellow",
        successHue: "green",
        neutralHue: "grey",
        chromeHue: "purple",
        variables: {
            dark: {
                background: {
                    default: "neutralHue.1100",
                    raised: "neutralHue.1000",
                    recessed: "neutralHue.1200",
                    subtle: "neutralHue.1000",
                    emphasis: "neutralHue.600",
                    success: "successHue.1000",
                    warning: "warningHue.1000",
                    danger: "dangerHue.1000",
                    primaryEmphasis: "primaryHue.600",
                    successEmphasis: "successHue.600",
                    warningEmphasis: "warningHue.600",
                    dangerEmphasis: "dangerHue.600",
                    disabled: "rgba(white, 100)"
                },
                border: {
                    default: "neutralHue.800",
                    emphasis: "neutralHue.600",
                    subtle: "neutralHue.900",
                    success: "successHue.900",
                    warning: "warningHue.900",
                    danger: "dangerHue.900",
                    primaryEmphasis: "primaryHue.600",
                    successEmphasis: "successHue.600",
                    warningEmphasis: "warningHue.600",
                    dangerEmphasis: "dangerHue.600",
                    disabled: "neutralHue.800"
                },
                foreground: {
                    default: "neutralHue.300",
                    subtle: "neutralHue.500",
                    onEmphasis: "neutralHue.1100",
                    primary: "primaryHue.600",
                    success: "successHue.400",
                    warning: "warningHue.400",
                    danger: "dangerHue.400",
                    successEmphasis: "successHue.300",
                    warningEmphasis: "warningHue.300",
                    dangerEmphasis: "dangerHue.300",
                    disabled: "neutralHue.700"
                },
                shadow: {
                    small: "rgba(neutralHue.1200, 1100)",
                    medium: "rgba(neutralHue.1200, 800)",
                    large: "rgba(neutralHue.1200, 1000)"
                }
            },
            light: {
                background: {
                    default: "palette.white",
                    raised: "palette.white",
                    recessed: "neutralHue.100",
                    subtle: "neutralHue.100",
                    emphasis: "neutralHue.700",
                    success: "successHue.100",
                    warning: "warningHue.100",
                    danger: "dangerHue.100",
                    primaryEmphasis: "primaryHue.700",
                    successEmphasis: "successHue.700",
                    warningEmphasis: "warningHue.700",
                    dangerEmphasis: "dangerHue.700",
                    disabled: "rgba(neutralHue.700, 100)"
                },
                border: {
                    default: "neutralHue.300",
                    emphasis: "neutralHue.600",
                    subtle: "neutralHue.200",
                    success: "successHue.300",
                    warning: "warningHue.300",
                    danger: "dangerHue.300",
                    primaryEmphasis: "primaryHue.700",
                    successEmphasis: "successHue.700",
                    warningEmphasis: "warningHue.700",
                    dangerEmphasis: "dangerHue.700",
                    disabled: "neutralHue.300"
                },
                foreground: {
                    default: "neutralHue.900",
                    subtle: "neutralHue.700",
                    onEmphasis: "palette.white",
                    primary: "primaryHue.700",
                    success: "successHue.700",
                    warning: "warningHue.700",
                    danger: "dangerHue.700",
                    successEmphasis: "successHue.900",
                    warningEmphasis: "warningHue.900",
                    dangerEmphasis: "dangerHue.900",
                    disabled: "neutralHue.600"
                },
                shadow: {
                    small: "rgba(neutralHue.1200, 200)",
                    medium: "rgba(neutralHue.1200, 200)",
                    large: "rgba(neutralHue.1200, 200)"
                }
            }
        }
    },
    components: {
        "accordions.button": css`
            padding: 1.25rem 0;
            line-height: 1;
        `,
        "accordions.rotate_icon": css`
            padding: 1.25rem 0;
        `,
        "accordions.header": css`
            gap: 8px;
        `,
        "accordions.step_inner_panel": css`
            overflow: auto;
            padding-bottom: 2px;
            max-height: 8rem;
        `,
        "accordions.panel": css`
            padding: 0 0 1.5rem 0;
        `,
        "forms.fieldset": css`
            display: flex;
            flex-direction: column;
            gap: 8px;
        `,
        "buttons.anchor": css`
            color: ${themeSettings.link_color};
            :hover,
            :active,
            :focus {
            color: ${themeSettings.hover_link_color};
            }
            &:visited {
            color: ${themeSettings.visited_link_color};
            }
        `,
       "buttons.button": css`
         ${(props: IButtonProps) =>
           props.isPrimary &&
           css`
             color: ${themeSettings.brand_text_color};
           `}
       `,
       "forms.input": accessibleFormInputStyle,
       "forms.textarea": accessibleFormInputStyle,
       "forms.faux_input": accessibleFormInputStyle,
       "dropdowns.combobox.trigger": accessibleFormWrapperStyle,
    },
    fonts: {
        mono: "SFMono-Regular,Consolas,\"Liberation Mono\",Menlo,Courier,monospace",
        system: "system-ui,-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,Oxygen-Sans,Ubuntu,Cantarell,\"Helvetica Neue\",Arial,sans-serif"
    },
    fontSizes: {
        xs: "12px",
        sm: "14px",
        md: "16px",
        lg: "18px",
        xl: "22px",
        xxl: "26px",
        xxxl: "36px"
    },
    fontWeights: {
        thin: 100,
        extralight: 200,
        light: 300,
        regular: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
        black: 900
    },
    iconSizes: {
        sm: "12px",
        md: "16px",
        lg: "26px"
    },
    lineHeights: {
        sm: "16px",
        md: "20px",
        lg: "24px",
        xl: "28px",
        xxl: "32px",
        xxxl: "44px"
    },
    opacity: {
        100: 0.08,
        200: 0.16,
        300: 0.24,
        400: 0.32,
        500: 0.4,
        600: 0.48,
        700: 0.56,
        800: 0.64,
        900: 0.72,
        1000: 0.8,
        1100: 0.88,
        1200: 0.96
    },
    palette: qoriaPalette,
    rtl: document.dir === "rtl",
    shadowWidths: {
        xs: "1px",
        sm: "2px",
        md: "3px"
    },
    //shadows: {
    //    xs: " => expression",
    //    sm: " => expression",
    //    md: " => expression",
    //    lg: "(e,t,n) => expression"
    //},
    space: {
        base: 4,
        xxs: "4px",
        xs: "8px",
        sm: "12px",
        md: "20px",
        lg: "32px",
        xl: "40px",
        xxl: "48px"
    }
  } as IGardenTheme;
