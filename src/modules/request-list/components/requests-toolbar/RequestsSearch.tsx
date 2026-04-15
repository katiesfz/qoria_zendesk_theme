import { useRef, useState } from "react";
import styled, { css, DefaultTheme, ThemeProvider } from "styled-components";
import type { FormEvent } from "react";
import { Field, MediaInput, InputGroup } from "@zendeskgarden/react-forms";
import { media, Mobile, Desktop } from "../../utils/mediaQuery";
//import SearchIcon from "@zendeskgarden/svg-icons/src/16/search-stroke.svg";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH } from '@awesome.me/kit-b56161fd23/icons/classic/regular';
import { Button } from '@zendeskgarden/react-buttons';
import { qoriaTheme } from "../../../shared";
import { getColor } from '@zendeskgarden/react-theming';


const SearchIcon = <FontAwesomeIcon icon={faSearch} />;

interface RequestsSearchProps {
  query: string;
  onSearchSubmit: (value: string) => void;
  filterDrawer: () => void;
}

const Form = styled.form`
  flex: 1 0 auto;
  position: sticky;
  top: 0px;
  ${media.desktop`
  `};
`;


const createAccessibleFormControlStyle = (isWrapper: boolean) => {
  const invalidSelector = isWrapper
    ? ':has(input[aria-invalid="true"])'
    : '[aria-invalid="true"]';

  return css`
    &:hover:not(${invalidSelector}) {
      border-color: transparent;
    }

    &:focus:not(${invalidSelector}) {
      border-color: transparent;
    }

    &:focus-visible {
      box-shadow: none;
      border-color: transparent;
      background-color: ${(p) =>
              getColor({
                theme: p.theme,
                hue: "primaryHue",
                transparency: 0.8,
                dark: { shade: 900 },
                light: { shade: 200 },
              })};
    }


    box-shadow: unset;
    padding: ${p => p.theme.space.md};
    border-width: 1px;
    border-radius: 0;
    background-color: ${(p) =>
            getColor({
              theme: p.theme,
              hue: "primaryHue",
              transparency: 0.8,
              dark: { shade: 800 },
              light: { shade: 100 },
            })};
  `;
};

const SearchInputTheme = {
  ...qoriaTheme,
  "components": {
    ...qoriaTheme.components,
    "forms.fieldset_legend": css`
        font-size: ${p => p.theme.fontSizes.md};
        margin-bottom: ${(p) => p.theme.remSpace.md};
    `,
    "forms.faux_input": createAccessibleFormControlStyle(false),
    "buttons.button": css`
        height: 100%;
    `
  }
} as DefaultTheme;


export default function RequestsSearch({
  query,
  onSearchSubmit,
  filterDrawer,
}: RequestsSearchProps): JSX.Element {
  const { t } = useTranslation();

  const searchInputRef = useRef<HTMLInputElement>(null);

  const onSearchChange = (event: FormEvent): void => {
    event.preventDefault();
    if (searchInputRef.current !== null) {
      onSearchSubmit(searchInputRef.current.value);
    }
  };

  return (
    <ThemeProvider theme={SearchInputTheme}>
      <Form onSubmit={onSearchChange}>
        <Field>
          <Field.Label hidden>
            {t("guide-requests-app.searchField.Label", "Search")}
          </Field.Label>
          <InputGroup>
            <Mobile>
              <Button isPrimary onClick={filterDrawer}>
                <FontAwesomeIcon icon={faSlidersH} />
              </Button>
            </Mobile>
            <MediaInput
              end={SearchIcon}
              ref={searchInputRef}
              type="search"
              defaultValue={query}
            />
          </InputGroup>
        </Field>
      </Form>
    </ThemeProvider>
    
  );
}
