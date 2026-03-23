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

const Container = styled.aside`
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

const FormTitle = styled.h2`
  margin: 0;
  margin-bottom: 1em;
  font-size: 18px;
  font-weight: 600;
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
    <Container aria-labelledby="section-requests-title">
      <SearchBlock>
        <RequestsSearch query={query} onSearchSubmit={onSearchSubmit} />
      </SearchBlock>
      <div className="requests-sidebar-sticky request-filter-container">
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
        {isOrganizationTab && hasOrganizations && user && (
          <OrganizationsManagementBlock>
            <Desktop>
              <OrganizationsManagement
                organizations={organizations}
                user={user}
              />
            </Desktop>
          </OrganizationsManagementBlock>
        )}
        
        <FormTitle>
          {t("guide-requests-app.filters-modal.title", "Filters")}
        </FormTitle>
        <FilterTags
          filters={filters}
          ticketFields={ticketFields}
          organizations={organizations}
          customStatusOptions={customStatusOptions}
          onFiltersChanged={onFiltersChanged}
        />
        <FiltersContainer
          filters={filters}
          ticketFields={ticketFields}
          filterValuesMap={filters}
          onFiltersChanged={onFiltersChanged}
          organizations={isOrganizationTab ? [] : organizations}
          customStatusesEnabled={customStatusesEnabled}
          customStatusOptions={customStatusOptions}
        />
      </div>
    </Container>
  );
}
