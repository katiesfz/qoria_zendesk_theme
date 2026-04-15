import { useRef, useState } from "react";
import styled from "styled-components";
import type { FormEvent } from "react";
import { Field, MediaInput, InputGroup } from "@zendeskgarden/react-forms";
import { media, Mobile, Desktop } from "../../utils/mediaQuery";
//import SearchIcon from "@zendeskgarden/svg-icons/src/16/search-stroke.svg";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faSlidersH } from '@awesome.me/kit-b56161fd23/icons/classic/regular';
import { Button } from '@zendeskgarden/react-buttons';


const SearchIcon = <FontAwesomeIcon icon={faSearch} />;
const SlidersIcon = <FontAwesomeIcon icon={faSlidersH} />;

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
    <Form onSubmit={onSearchChange}>
      <Field>
        <Field.Label hidden>
          {t("guide-requests-app.searchField.Label", "Search")}
        </Field.Label>
        <Mobile>
        <InputGroup>
          <Button focusInset isNeutral onClick={filterDrawer}>
            <FontAwesomeIcon icon={faSlidersH} />
          </Button>
          <MediaInput
            end={SearchIcon}
            ref={searchInputRef}
            type="search"
            defaultValue={query}
          />
        </InputGroup>
        </Mobile>
        <Desktop>
          <MediaInput
            end={SearchIcon}
            ref={searchInputRef}
            type="search"
            defaultValue={query}
          />
        </Desktop>
      </Field>
    </Form>
    
  );
}
