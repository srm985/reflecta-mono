import {
    useState
} from 'react';

import ButtonComponent from '@components/ButtonComponent';

import ModalComponent from './index';

import {
    IModalComponent
} from './types';

export default {
    component: ModalComponent,
    title: 'Modal'
};

const Template = (args: IModalComponent) => {
    const [
        isOpen,
        setOpen
    ] = useState(false);

    const toggleOpen = () => {
        setOpen(!isOpen);
    };

    return (
        <>
            {
                isOpen && (
                    <ModalComponent
                        {...args}
                        onClose={toggleOpen}
                    >
                        <h3>{'Pariatur deserunt proident minim ipsum anim mollit nisi veniam culpa irure do officia.'}</h3>
                        <p>{'Ad qui aute incididunt et labore esse nostrud proident culpa ut qui sit ullamco. Ut Lorem ea magna sunt proident tempor nulla adipisicing officia cupidatat incididunt velit. In non enim sit excepteur eu. Adipisicing non quis eu ullamco dolore amet ut quis amet cillum consectetur adipisicing aute sint.'}</p>
                    </ModalComponent>
                )
            }

            <ButtonComponent onClick={toggleOpen}>{'Toggle Modal'}</ButtonComponent>
        </>
    );
};

export const Default = Template.bind({});
