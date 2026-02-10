"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var playwright_1 = require("playwright");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var browser, context, page;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, playwright_1.chromium.launch({ headless: false })];
            case 1:
                browser = _a.sent();
                return [4 /*yield*/, browser.newContext()];
            case 2:
                context = _a.sent();
                return [4 /*yield*/, context.newPage()];
            case 3:
                page = _a.sent();
                console.log('サイトにアクセス中...');
                return [4 /*yield*/, page.goto('https://www.treat-co-ltd.co.jp/reservation_register?hallCode=3')];
            case 4:
                _a.sent();
                // 1. 挙式日の入力（例として2026年7月12日）
                // 実際のHTML要素のIDに合わせて調整が必要な場合があります
                return [4 /*yield*/, page.fill('input[type="text"]', '2026年07月12日')];
            case 5:
                // 1. 挙式日の入力（例として2026年7月12日）
                // 実際のHTML要素のIDに合わせて調整が必要な場合があります
                _a.sent();
                // 2. 「ご来店店舗」を選択（青山店を選択する例）
                // セレクトボックスの値を指定します
                return [4 /*yield*/, page.selectOption('select', { label: '青山本店' })];
            case 6:
                // 2. 「ご来店店舗」を選択（青山店を選択する例）
                // セレクトボックスの値を指定します
                _a.sent();
                console.log('カレンダーを表示します...');
                // 3. 「ご来店希望日」をクリックしてカレンダーを出す
                // プレースホルダーや要素の順番で指定
                return [4 /*yield*/, page.click('input[placeholder="ご希望日を選択してください"]')];
            case 7:
                // 3. 「ご来店希望日」をクリックしてカレンダーを出す
                // プレースホルダーや要素の順番で指定
                _a.sent();
                // カレンダーが読み込まれるのを少し待つ
                return [4 /*yield*/, page.waitForTimeout(2000)];
            case 8:
                // カレンダーが読み込まれるのを少し待つ
                _a.sent();
                // スクリーンショットを撮って確認してみる
                return [4 /*yield*/, page.screenshot({ path: 'calendar_check.png' })];
            case 9:
                // スクリーンショットを撮って確認してみる
                _a.sent();
                console.log('スクリーンショットを保存しました。内容を確認してください。');
                return [2 /*return*/];
        }
    });
}); })();
