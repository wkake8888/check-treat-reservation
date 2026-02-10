import { chromium } from 'playwright';
import axios from 'axios';

// --- 設定項目 ---
const SLACK_WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL || '';
const TARGET_MONTH = '2026年2月'; // 監視したい月
const CHECK_INTERVAL = 60 * 1000; // 1分

async function sendSlack(message: string) {
    try {
        await axios.post(SLACK_WEBHOOK_URL, { text: message });
        console.log('Slack通知を送信しました。');
    } catch (e) {
        console.error('Slack送信失敗:', e);
    }
}

async function runCheck() {
    console.log(`[${new Date().toLocaleTimeString()}] 空き状況をチェック中...`);
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('https://www.treat-co-ltd.co.jp/reservation_register?hallCode=3', {
            waitUntil: 'domcontentloaded'
        });

        // --- 1. 挙式日の入力（カレンダーから選択） ---
        const weddingDateInput = page.locator('input:not([type="hidden"]).flatpickr-input');
        await weddingDateInput.click();

        // カレンダーが浮かび上がるのを待つ
        await page.waitForSelector('.flatpickr-calendar.open');
        for (let i = 0; i < 5; i++) {
            // ※現在は2月なので i+3 にすると 3月, 4月... となります。
            const expectedMonth = (i + 3).toString() + "月";

            // 1. 次の月ボタンをクリック
            await page.locator('.flatpickr-calendar.open .flatpickr-next-month').click();

            // 2. 指定した月（例: "3月"）が表示されるまで待機
            await page.locator('.flatpickr-calendar.open .cur-month')
                    .getByText(expectedMonth)
                    .waitFor({ state: 'visible', timeout: 5000 });

        }
        await page.waitForTimeout(1000)
        // カレンダー内の「12」日をクリック
        // ※ open状態のカレンダーかつ、前後の月の数字を除外してクリック
        await page.locator('.flatpickr-calendar.open .flatpickr-day:not(.prevMonthDay):not(.nextMonthDay)').getByText('12', { exact: true }).click();

        const weddingDateConfirmed = page.locator('#weddingDate')
        const weddingDate = await weddingDateConfirmed.getAttribute('value');
        console.log('選択した挙式日:', weddingDate);

        // --- 2. ご来店希望日（監視ターゲット）のカレンダーを表示 ---
        const visitDateTrigger = page.locator('#visitdate').getByRole('textbox');
        await visitDateTrigger.waitFor({ state: 'visible', timeout: 15000 });
        await visitDateTrigger.click();
        // カレンダーが表示されるのを待つ
        // flatpickrは動的に生成されるので、出現を待機
        await page.waitForSelector('.flatpickr-calendar.open', { state: 'visible' });
        await page.waitForTimeout(2000);
        // 3. 「○」があるかチェック
        // Playwrightの locator.count() を使って「○」の数を数えます
        // --- 3. 空き状況（○）の判定 ---
        // spanタグで、クラス名が reservation-event-box、かつ中身が「○」のものを探す
        const allBoxes = page.locator('span.reservation-event-box');
        const texts = await allBoxes.allInnerTexts();

        // 2. ターミナルに表示
        console.log("取得した記号一覧:", texts); 

        // 3. 個数も確認
        console.log("要素の総数:", await allBoxes.count());
        const slots = page.locator('.flatpickr-day:not(.prevMonthDay):not(.nextMonthDay) span.reservation-event-box')
                  .filter({ hasText: '×' });

        // 見つかった数をカウント
        const count = await slots.count();

        if (count > 0) {
            console.log("空きがあったよ")
            const msg = `<!channel> 🌟【予約空き発見！】\n${TARGET_MONTH}のカレンダーに空きが ${count} 件見つかりました！\n今すぐ予約： https://www.treat-co-ltd.co.jp/reservation_register?hallCode=3`;
            await sendSlack(msg);
        } else {
            console.log('現在、空きはありません。');
        }

    } catch (error) {
        console.error('実行エラー:', error);
    } finally {
        await browser.close();
    }
}

(async () => {
    console.log('--- 監視チェック開始 ---');
    await runCheck();
    console.log('--- 監視チェック終了 ---');
    process.exit(0); // これを忘れると Actions が「終わった」と認識してくれないことがあります
})();
