import { AvChooserPage } from './app.po';

describe('av-chooser App', () => {
  let page: AvChooserPage;

  beforeEach(() => {
    page = new AvChooserPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
