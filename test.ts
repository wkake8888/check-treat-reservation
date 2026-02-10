console.log('--- プログラムが開始されました ---'); // 1行目に追加
import { chromium } from 'playwright';

(async () => {
  console.log('ブラウザを起動します...');
  const browser = await chromium.launch({ headless: false }); 
  const page = await browser.newPage();
  
  await page.goto('https://www.google.com');
  console.log('Googleが開けました！');
  
  // 30秒間そのままにする（動きを確認するため）
  await new Promise(resolve => setTimeout(resolve, 30000));
  await browser.close();
})();