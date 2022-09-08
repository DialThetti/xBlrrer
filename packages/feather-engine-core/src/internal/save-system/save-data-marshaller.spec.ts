import { JSONSaveDataMarshaller } from './save-data-marshaller';

describe('JSONSaveDataMarshaller', () => {
  const marshaller = new JSONSaveDataMarshaller();
  it('should marshal data', () => {
    const data = marshaller.marshal({ a: 'b' });
    expect(data).toBe('{"a":"b"}');
  });
  it('should demarshal data', () => {
    const data = marshaller.unmarshal('{"a":"b"}');
    expect(data).toStrictEqual({ a: 'b' });
  });
});
