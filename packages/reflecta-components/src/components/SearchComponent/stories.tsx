import GridContainerComponent from '@components/GridContainerComponent';
import GridItemComponent from '@components/GridItemComponent';

import SearchComponent from './index';

import {
    ISearchComponent, Search
} from './types';

export default {
    component: SearchComponent,
    title: 'Search'
};

const Template = (args: ISearchComponent) => {
    const handleSearch = (search: Search) => {
        console.log(search);
    };

    return (
        <GridContainerComponent>
            <GridItemComponent>
                <SearchComponent
                    {...args}
                    onSearch={handleSearch}
                />
            </GridItemComponent>
        </GridContainerComponent>
    );
};

export const Default = Template.bind({});
