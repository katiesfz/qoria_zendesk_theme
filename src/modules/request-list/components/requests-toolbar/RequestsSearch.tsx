import { useRef } from "react";
import styled from "styled-components";
import type { FormEvent } from "react";
import { Field, MediaInput } from "@zendeskgarden/react-forms";
import { media, Mobile, Desktop } from "../../utils/mediaQuery";
//import SearchIcon from "@zendeskgarden/svg-icons/src/16/search-stroke.svg";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@awesome.me/kit-b56161fd23/icons/classic/regular';


const SearchIcon = <FontAwesomeIcon icon={faSearch} />;

interface RequestsSearchProps {
  query: string;
  onSearchSubmit: (value: string) => void;
}



const Form = styled.form`
  flex: 1 0 auto;
  margin-bottom: 16px;
  position: sticky;
  top: 0px;
  ${media.desktop`
    border: 0;
    flex: 0 0 25%;
    height: auto;
    max-width: 25%;
    margin-right: 16px;
    align-items: stretch;
    display: flex;
    flex-direction: column;
    gap: 16px;
  `};
`;

export default function RequestsSearch({
  query,
  onSearchSubmit,
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
    <Form onSubmit={onSearchChange} className="search search-full search-transparent">
      <Field>
        <Field.Label hidden>
          {t("guide-requests-app.searchField.Label", "Search")}
        </Field.Label>
        <MediaInput
          end={SearchIcon}
          ref={searchInputRef}
          type="search"
          defaultValue={query}
        />
      </Field>
    </Form>
  );
}
