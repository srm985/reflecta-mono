import GridContainerComponent from '@components/GridContainerComponent';
import GridItemComponent from '@components/GridItemComponent';

import SearchbarComponent from './index';

import {
    ISearchbarComponent
} from './types';

export default {
    component: SearchbarComponent,
    title: 'Searchbar'
};

const Template = (args: ISearchbarComponent) => (
    <GridContainerComponent>
        <GridItemComponent>
            <SearchbarComponent {...args} />
        </GridItemComponent>
    </GridContainerComponent>
);

export const Default = Template.bind({});
