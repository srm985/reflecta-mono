import GridContainerComponent from '@components/GridContainerComponent';
import GridItemComponent from '@components/GridItemComponent';

import SearchComponent from './index';

import {
    ISearchComponent
} from './types';

export default {
    component: SearchComponent,
    title: 'Search'
};

const Template = (args: ISearchComponent) => (
    <GridContainerComponent>
        <GridItemComponent>
            <SearchComponent {...args} />
        </GridItemComponent>
    </GridContainerComponent>
);

export const Default = Template.bind({});
