import {
    HTMLInputTypeAttribute
} from 'react';

export type AutoComplete = 'off' | 'on' | 'name' | 'honorific-prefix' | 'given-name' | 'additional-name' | 'family-name' | 'honorific-suffix' | 'nickname' | 'username' | 'new-password' | 'current-password' | 'organization-title' | 'organization' | 'street-address' | 'address-line1' | 'address-line2' | 'address-line3' | 'address-level4' | 'address-level3' | 'address-level2' | 'address-level1' | 'country' | 'country-name' | 'postal-code' | 'cc-name' | 'cc-given-name' | 'cc-additional-name' | 'cc-family-name' | 'cc-number' | 'cc-exp' | 'cc-exp-month' | 'cc-exp-year' | 'cc-csc' | 'cc-type' | 'transaction-currency' | 'transaction-amount' | 'language' | 'bday' | 'bday-day' | 'bday-month' | 'bday-year' | 'sex' | 'url' | 'photo';

export type Value = string | number;

export type IInputComponent = {
    autoCompleteType?: AutoComplete;
    className?: string;
    defaultValue?: Value;
    disabled?: boolean;
    label: string;
    name: string;
    onChange: (argument: string) => void;
    required?: boolean;
    type?: HTMLInputTypeAttribute;
    value: Value;
};
