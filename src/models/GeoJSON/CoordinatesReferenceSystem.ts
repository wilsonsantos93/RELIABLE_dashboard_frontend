import {CRSLatLongProperties} from "./CoordinatesReferenceSystem/CRSLatLongProperties";

export interface CoordinatesReferenceSystem {
    readonly type?: "name";
    readonly properties?: CRSLatLongProperties;
}