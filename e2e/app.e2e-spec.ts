import { ZooverPage } from './app.po';

describe('zoover App', () => {
  let page: ZooverPage;

  beforeEach(() => {
    page = new ZooverPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
