export type MetadataJSONValues =
  | number
  | string
  | boolean
  | MetadataJSONArray
  | MetadataJSONObject;
export type MetadataJSONArray = MetadataJSONValues[];
export type MetadataJSONObject = {
  [key: string]: MetadataJSONValues;
};
