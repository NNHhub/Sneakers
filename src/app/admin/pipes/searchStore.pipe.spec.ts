import { searchStorePipe } from './searchStore.pipe';

describe('searchStorePipe', () => {
  it('create an instance', () => {
    const pipe = new searchStorePipe();
    expect(pipe).toBeTruthy();
  });
});
