import _ from "lodash";

export const allEqual = (arr: any[]) => _.every(arr, item => _.isEqual(item, _.head(arr)));