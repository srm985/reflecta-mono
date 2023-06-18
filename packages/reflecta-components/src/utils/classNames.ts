export type DynamicClassTuple = [string, string | boolean];

export type ClassObject = { [key: string]: string | boolean };

export type ClassNameInputParameter = string | ClassObject | undefined;

const classNames = (...classNameInputParametersList: ClassNameInputParameter[]): string => classNameInputParametersList.reduce((classList: string, className: ClassNameInputParameter) => {
    if (!className) {
        return classList;
    }

    if (typeof className === 'string') {
        return `${classList} ${className.trim()}`;
    }

    const dynamicClassNames = Object.entries(className).reduce((resolvedClassNames: string, [
        dynamicClassName,
        isClassApplied
    ]:
    DynamicClassTuple) => {
        if (isClassApplied) {
            return `${resolvedClassNames} ${dynamicClassName.trim()}`;
        }

        return resolvedClassNames;
    }, '').trim();

    return `${classList} ${dynamicClassNames}`;
}, '').trim();

export default classNames;
