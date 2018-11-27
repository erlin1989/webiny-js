// @flow
import * as React from "react";
import warning from "warning";
import { pure } from "recompose";
import { Query } from "react-apollo";
import { loadPages } from "./graphql";

const PagesList = pure(({ settings, theme }: Object = {}) => {
    const { component, ...vars } = settings;
    const pageList = theme.elements.pagesList.components.find(cmp => cmp.name === component);

    if (!pageList) {
        warning(false, `Pages list component "${component}" is missing!`);
        return null;
    }

    const { component: ListComponent } = pageList;

    if (!ListComponent) {
        warning(false, `React component is not defined for "${component}"!`);
        return null;
    }

    let sort = null;
    if (vars.sortBy) {
        sort = { [vars.sortBy]: vars.sortDirection || -1 };
    }

    return (
        <Query
            query={loadPages}
            variables={{
                category: vars.category,
                sort,
                tags: vars.tags,
                tagsRule: vars.tagsRule,
                perPage: vars.limit,
                page: 1
            }}
        >
            {({ data, loading }) => {
                if (loading) {
                    return null;
                }

                const pages = data.cms.listPublishedPages;

                if (!pages || !pages.data.length) {
                    return null;
                }

                return <ListComponent {...pages} theme={theme} />;
            }}
        </Query>
    );
});

export default PagesList;