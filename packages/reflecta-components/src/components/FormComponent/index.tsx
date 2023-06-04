import classNames from '@utils/classNames';

import {
    IFormComponent
} from './types';

const FormComponent: React.FC<IFormComponent> = (props) => {
    const {
        children,
        className,
        onSubmit
    } = props;

    const {
        displayName
    } = FormComponent;

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <form
            className={componentClassNames}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
};

FormComponent.displayName = 'FormComponent';

export default FormComponent;
