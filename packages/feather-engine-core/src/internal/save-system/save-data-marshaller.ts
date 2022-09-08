export interface SaveDataMarshaller<T> {
  marshal(data: T): string;
  unmarshal(data: string): T;
}
export class JSONSaveDataMarshaller implements SaveDataMarshaller<any> {
  marshal<T>(data: T): string {
    return JSON.stringify(data);
  }
  unmarshal<T>(data: string): T {
    return JSON.parse(data);
  }
}
