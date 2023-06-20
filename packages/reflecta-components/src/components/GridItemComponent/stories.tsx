import GridContainerComponent from '@components/GridContainerComponent';

import GridItemComponent from './index';

import {
    IGridItemComponent
} from './types';

export default {
    component: GridItemComponent,
    title: 'Grid Item'
};

const Template = (args: IGridItemComponent) => (
    <GridContainerComponent>
        <GridItemComponent
            {...args}
            breakpointMedium={{
                start: 1,
                stop: 8
            }}
        >
            <div>
                <h1>{'Commodo deserunt sit cillum cillum magna laborum laboris exercitation eu elit.'}</h1>
                <p>{'Velit eu adipisicing consectetur nisi occaecat Lorem eiusmod nostrud voluptate. Sunt amet mollit pariatur elit reprehenderit dolor eu qui. Voluptate cupidatat est exercitation non officia consectetur anim. Ut qui deserunt in non. Dolor in fugiat voluptate eu incididunt. Labore qui ea anim id. Proident ut qui ex nostrud amet qui.'}</p>
            </div>
        </GridItemComponent>
    </GridContainerComponent>
);

export const Default = Template.bind({});
