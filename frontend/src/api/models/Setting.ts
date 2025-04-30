/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Setting = {
    updated_at: string;
    key_id: string;
    updated_by: string;
    updated_by_name: string;
    data: {
        [key: string]: Array<string>;
    };
};
interface SettingListResponse {
    settings: Array<Setting>;
}
export type Settings = SettingListResponse;