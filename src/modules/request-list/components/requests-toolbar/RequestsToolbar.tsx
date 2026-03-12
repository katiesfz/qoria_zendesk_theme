import styled from "styled-components";
import { Span } from "@zendeskgarden/react-typography";
import { useTranslation } from "react-i18next";
import RequestsSearch from "./RequestsSearch";
import OrganizationsDropdown from "./organizations-dropdown/OrganizationsDropdown";
import OrganizationsManagement from "./organizatios-management/OrganizationsManagement";
import { media, Mobile, Desktop } from "../../utils/mediaQuery";
import type {
  CustomStatus,
  Organization,
  TicketField,
  User,
} from "../../data-types";
import { useMemo, useState } from "react";
import type { FilterValuesMap } from "../../data-types/FilterValue";
import type { SelectedTab } from "../../data-types/request-list-params";
import { ORG_REQUESTS_TAB_NAME } from "../../data-types/request-list-params";
import { FilterModal } from "./filter-modal/FilterModal";
import { FiltersContainer } from "./filters-container/FiltersContainer";
import { FilterPropertyDropdown } from "./filters-container/FilterPropertyDropdown";
import { Button } from "@zendeskgarden/react-buttons";
import { FilterTags } from "./filter-tags/FilterTags";
import type { MultiSelectOption } from "./filter-modal/Multiselect";
import { StyledSpan } from "../../../shared/styles"; 

interface RequestsToolbarProps {
  query: string;
  onSearchSubmit: (value: string) => void;
  filters: FilterValuesMap;
  onFiltersChanged: (items: FilterValuesMap) => void;
  selectedTab: SelectedTab;
  onOrganizationSelected: (organizationId: number) => void;
  hasPagination: boolean;
  page: number;
  requestsCount: number;
  requestsPerPage: number;
  organizations: Organization[];
  user?: User;
  ticketFields: TicketField[];
  customStatusesEnabled: boolean;
  customStatuses: CustomStatus[];
}

const Container = styled.div`

  align-items: flex-start;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
`;

const SearchBlock = styled(Block)`
  width: 100%;
`;

const RequestsFilterMenuBlock = Block;

const OrganizationBlock = styled(Block)`
  ${media.mobile`
    align-items: flex-end;
    flex-direction: row;
    gap: 12px;
  `};
`;

const OrganizationsManagementBlock = styled(Block)`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-grow: 1;
`;

/**
 * This function creates an array of `MultiSelectOption`, grouping options
 * with the same label together.
 *
 * For example, from this array of custom statuses
 * ```
 * [
 *  { id: 1, label: "Open", ...},
 *  { id: 2, label: "Open", ... },
 *  { id: 3, label: "Solved", ... },
 *  { id: 4, label: "Closed", ... },
 * ]
 * ```
 *
 * It will return
 * ```
 * [
 *  { label: "Open", value: ":1 :2" },
 *  { label: "Solved", value: ":3" },
 *  { label: "Open", value: ":4" },
 * ]
 * ```
 * @param customStatuses Array of custom statuses
 * @returns A array of multiselect option
 */
function createCustomStatusOptions(
  customStatuses: CustomStatus[]
): MultiSelectOption[] {
  const res: MultiSelectOption[] = [];

  for (const customStatus of customStatuses) {
    const label = (customStatus.label ?? customStatus.end_user_label) as string;
    const existingOption = res.find((option) => option.label === label);

    if (existingOption) {
      existingOption.value += ` :${customStatus.id}`;
    } else {
      res.push({ label, value: `:${customStatus.id}` });
    }
  }

  return res;
}

export default function RequestsToolbar({
  hasPagination,
  page,
  requestsCount,
  requestsPerPage,
  query,
  onSearchSubmit,
  filters,
  onFiltersChanged,
  organizations,
  selectedTab,
  onOrganizationSelected,
  user,
  ticketFields,
  customStatuses,
  customStatusesEnabled,
}: RequestsToolbarProps): JSX.Element {
  const { t } = useTranslation();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [isFiltersShown, setIsFiltersShown] = useState(false);

  const handleFilters = () => {
    setIsFiltersShown(!isFiltersShown);
  };

  const customStatusOptions = useMemo(
    () => createCustomStatusOptions(customStatuses),
    [customStatuses]
  );

  const from = (page - 1) * requestsPerPage + 1;
  let to = from + requestsPerPage - 1;
  if (to > requestsCount) to = requestsCount;

  const isOrganizationTab = selectedTab.name === ORG_REQUESTS_TAB_NAME;
  const hasOrganizations = organizations.length > 0;

  return (
    <>
      <Container>
        <SearchBlock>
          <RequestsSearch query={query} onSearchSubmit={onSearchSubmit} />
        </SearchBlock>
        {isOrganizationTab && (
          <OrganizationBlock>
            <OrganizationsDropdown
              organizations={organizations}
              currentOrganizationId={selectedTab.organizationId}
              onOrganizationSelected={onOrganizationSelected}
            />
            {hasOrganizations && user && (
              <Mobile>
                <OrganizationsManagement
                  organizations={organizations}
                  user={user}
                />
              </Mobile>
            )}
          </OrganizationBlock>
        )}
        <RequestsFilterMenuBlock>
          <Button
            // onClick={() => {
            //   setIsFilterModalOpen(true);
            // }}
            onClick={() => {
              handleFilters;
            }}
          >
            {isFiltersShown ? (
              "Hide filters"
            ) : (
              "Show filters"
            )}
          </Button>
        </RequestsFilterMenuBlock>
        <OrganizationsManagementBlock>
          <Desktop>
            {isOrganizationTab && hasOrganizations && user && (
              <OrganizationsManagement
                organizations={organizations}
                user={user}
              />
            )}
          </Desktop>
        </OrganizationsManagementBlock>
      </Container>
      <FilterTags
        filters={filters}
        ticketFields={ticketFields}
        organizations={organizations}
        customStatusOptions={customStatusOptions}
        onFiltersChanged={onFiltersChanged}
      />
        <FiltersContainer
          ticketFields={ticketFields}
          filterValuesMap={filters}
          onFiltersChanged={onFiltersChanged}
          organizations={isOrganizationTab ? [] : organizations}
          customStatusesEnabled={customStatusesEnabled}
          customStatusOptions={customStatusOptions}
        />
    </>
  );
}
