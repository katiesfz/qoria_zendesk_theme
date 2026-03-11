import { useRef } from "react";
import type { FormEvent } from "react";
import { Field, MediaInput } from "@zendeskgarden/react-forms";
//import SearchIcon from "@zendeskgarden/svg-icons/src/16/search-stroke.svg";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@awesome.me/kit-b56161fd23/icons/classic/regular';


const SearchIcon = <FontAwesomeIcon icon={faSearch} />;

interface RequestsSearchProps {
  query: string;
  onSearchSubmit: (value: string) => void;
}

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
    <form onSubmit={onSearchChange}>
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
    </form>
  );
}
