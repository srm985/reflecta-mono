import {
    useState
} from 'react';

import classNames from '@utils/classNames';

import {
    IFormComponent
} from './types';

import './styles.scss';

const FormComponent: React.FC<IFormComponent> = (props) => {
    const {
        children,
        className,
        onDirty = () => {},
        onSubmit
    } = props;

    const {
        displayName
    } = FormComponent;

    const [
        isDirty,
        setIsDirty
    ] = useState<boolean>(false);

    const handleSetDirty = () => {
        if (!isDirty) {
            onDirty();

            setIsDirty(true);
        }
    };

    const componentClassNames = classNames(
        displayName,
        className
    );

    return (
        <form
            className={componentClassNames}
            onChange={handleSetDirty}
            onSubmit={onSubmit}
        >
            {children}
        </form>
    );
};

FormComponent.displayName = 'FormComponent';

export default FormComponent;
