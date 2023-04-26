import './style.scss';

const ButtonComponent = () => {
    const {
        displayName
    } = ButtonComponent;

    return (
        <button
            className={displayName}
            type={'button'}
        >
            {'click!'}
        </button>
    );
};

ButtonComponent.displayName = 'ButtonComponent';

export default ButtonComponent;
