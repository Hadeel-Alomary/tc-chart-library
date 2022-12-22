import {Tc} from '../../utils';

export class HtmlViews {

    private static chartTooltip = `
<div class="chart-tooltip-container">

    <!-- Price tooltip -->
    <table class="chartTooltip"  id="scxPriceTooltip">
        <tr class="scxPriceTooltip-row">
            <td class="translate">التاريخ</td>
            <td id="scxPriceTooltip-dateValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">الوقت</td>
            <td id="scxPriceTooltip-timeValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">الاغلاق</td>
            <td id="scxPriceTooltip-closeValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">الافتتاح</td>
            <td id="scxPriceTooltip-openValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">الاعلى</td>
            <td id="scxPriceTooltip-highValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">الادنى</td>
            <td id="scxPriceTooltip-lowValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">الحجم</td>
            <td id="scxPriceTooltip-volumeValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">التغير</td>
            <td id="scxPriceTooltip-changeValue"></td>
        </tr>
        <tr class="scxPriceTooltip-row">
            <td class="translate">نسبة التغير</td>
            <td id="scxPriceTooltip-changePercentageValue"></td>
        </tr>
    </table>

    <!-- Indicator tooltip -->

    <table class="chartTooltip" id="scxIndicatorTooltip">
        <tr class="scxIndicatorTooltip-row">
            <td class="translate">التاريخ</td>
            <td id="scxIndicatorTooltip-dateValue"></td>
        </tr>
        <tr class="scxIndicatorTooltip-row">
            <td class="translate">الوقت</td>
            <td id="scxIndicatorTooltip-timeValue"></td>
        </tr>
    </table>


    <!-- Drawing tooltip -->

    <table class="chartTooltip" id="scxDrawingTooltip">
        <tr class="scxDrawingTooltip-row">
            <td class="scxDrawingTooltip-icon scxDrawingTooltip-change-icon"></td>
            <td class="english" id="scxDrawingTooltip-changeValue"></td>
            <td class="english" id="scxDrawingTooltip-changePercentageValue"></td>
        </tr>
        <tr class="scxDrawingTooltip-row">
            <td class="scxDrawingTooltip-icon scxDrawingTooltip-bars-icon"></td>
            <td class="english" id="scxDrawingTooltip-barsValue"></td>
            <td class="english" id="scxDrawingTooltip-periodValue"></td>
        </tr>
        <tr class="scxDrawingTooltip-row">
            <td class="scxDrawingTooltip-icon scxDrawingTooltip-angle-icon"></td>
            <td class="english" id="scxDrawingTooltip-angleValue" colspan="2"></td>
        </tr>
    </table>


    <!-- Split tooltip -->
    <table class="chartTooltip"  id="scxSplitTooltip">
        <tr class="scxSplitTooltip-row">
            <td class="translate">النوع</td>
            <td class="translate">أسهم مجانية</td>
        </tr>
        <tr class="scxSplitTooltip-row">
            <td class="translate">التاريخ</td>
            <td id="scxSplitTooltip-date"></td>
        </tr>
        <tr class="scxSplitTooltip-row">
            <td class="translate">النسبة</td>
            <td id="scxSplitTooltip-value">
                <span class="translate from-value-label">من</span>
                <span class="from-value"></span>
                <span class="translate to-value-label">إلى</span>
                <span class="to-value">1</span>
            </td>
        </tr>
    </table>

    <!-- trading tooltip -->
    <table class="chartTooltip"  id="scxTradingTooltip">
      <tr class="scxTradingTooltip-row">
        <td id="scxTradingTooltip-text"></td>
      </tr>
    </table>

    <!-- alert tooltip -->
    <table class="chartTooltip"  id="scxAlertTooltip">
      <tr class="scxAlertTooltip-row">
        <td id="scxAlertTooltip-text"></td>
      </tr>
    </table>

    <!-- loading image tooltip -->
    <table class="chartTooltip"  id="scxLoadingImageTooltip">
      <tr class="scxLoadingImageTooltip-row">
        <td id="scxLoadingImageTooltip-image"></td>
      </tr>
    </table>

    <!-- news tooltip -->
    <table class="chartTooltip"  id="scxNewsTooltip">
      <tr class="scxNewsTooltip-row">
        <td id="scxNewsTooltip-text"></td>
      </tr>
      <tr class="scxNewsTooltip-row">
        <td id="scxNewsTooltip-details">
          <a id="scxNewsTooltip-details-anchor" class="translate">التفاصيل</a>
        </td>
      </tr>
    </table>

</div>
    `;

    private static chartContextMenu = `
<ul id="scxChartContextMenu" class="dropdown-menu scxContextMenu" role="menu" >
    <li data-id="format"><a href="#">Format...</a></li>
</ul>
    `;
    private static alertDrawingContextMenu = `
<ul id="scxAlertDrawingContextMenu" class="dropdown-menu scxContextMenu" role="menu" >
  <li data-id="update"><a href="#" class="translate">تعديل</a></li>
  <li data-id="delete"><a href="#" class="translate">حذف</a></li>
</ul>
    `;

    private static drawingContextMenu = `
<ul id="scxDrawingContextMenu" class="dropdown-menu scxContextMenu" role="menu" >
    <li data-id="settings"><a href="#" class="translate">الإعدادات</a></li>
    <li data-id="trend-line-alert"><a href="#" class="translate">تنبيه خط اتجاه</a></li>
    <li data-id="clone"><a href="#" class="translate">نسخ</a></li>
    <li data-id="lock"><a href="#" class="translate">تثبيت</a></li>
    <li data-id="delete"><a href="#" class="translate">حذف</a></li>
</ul>
    `;
    private static indicatorContextMenu = `
<ul id="scxIndicatorContextMenu" class="dropdown-menu scxContextMenu" role="menu" >
    <li data-id="settings"><a href="#" class="translate">الإعدادات</a></li>
    <li data-id="alert"><a href="#" class="translate">تنبيه رسم بياني</a></li>
    <li data-id="visible"><a href="#" class="translate">اخفاء</a></li>
    <li data-id="delete"><a href="#" class="translate">حذف</a></li>
</ul>
    `;

    private static navigation = `
<div class="scxNavigation">
    <div>
        <span class="scxNavigation-btn scxNavigation-btn-scrollToFirst"></span>
        <span class="scxNavigation-btn scxNavigation-btn-scrollLeft"></span>
        <span class="scxNavigation-btn scxNavigation-btn-zoomOut"></span>
        <span class="scxNavigation-btn scxNavigation-btn-zoomIn"></span>
        <span class="scxNavigation-btn scxNavigation-btn-scrollRight"></span>
        <span class="scxNavigation-btn scxNavigation-btn-scrollToLast"></span>
    </div>
</div>
    `;

    private static chartSideContextMenu = `
<ul id="scxChartSideContextMenu" class="dropdown-menu scxContextMenu" role="menu" >
  <li data-id="alert"><a href="#"><span class="translate">إضافة تنبيه رسم بياني</span><span class="price-span-alert english"></span></a></li>
  <div class="divider"></div>
  <li data-id="buy"><a href="#"><span class="translate">شراء</span><span class="price-span-buy english"></span></a></li>
  <li data-id="sell"><a href="#"><span class="translate">بيع</span><span class="price-span-sell english"></span></a></li>
  <li data-id="stop"><a href="#"><span class="translate">وقف</span><span class="price-span-stop english"></span></a></li>
</ul>
    `;
    private static chartPanelMenu = `
<ul id="scxContextMenuOption" class="dropdown-menu scxContextMenu" role="menu" >
    <li data-id="alert"><a href="#" class="translate">إضافة تنبيه رسم البياني</a></li>
    <li class="scxMenuItemWithSubMenu moving-average">
        <a href="#" class="translate" >إضافة متوسط</a>
        <ul class="dropdown-menu" role="menu"></ul>
    </li>
    <div class="divider"></div>
    <li data-id="delete"><a href="#" class="translate">حذف اللوحه</a></li>
    <div data-id='delete-divider' class="divider"></div>
    <li data-id="chart-elements"><a href="#" class="translate">عناصر الرسم البياني</a></li>
    <div class="divider"></div>
    <li data-id="settings"><a href="#" class="translate">إعدادات</a></li>
</ul>    
    `;
    private static views:{[key:string]:string} = {
        'ChartTooltip' : HtmlViews.chartTooltip,
        'ChartContextMenu': HtmlViews.chartContextMenu,
        'AlertDrawingContextMenu': HtmlViews.alertDrawingContextMenu,
        'DrawingContextMenu': HtmlViews.drawingContextMenu,
        'IndicatorContextMenu': HtmlViews.indicatorContextMenu,
        'Navigation': HtmlViews.navigation,
        'ChartSideContextMenu': HtmlViews.chartSideContextMenu,
        'ChartPanelMenu': HtmlViews.chartPanelMenu,
    }


    public static getView(viewName:string):string {
        Tc.assert(viewName in HtmlViews.views, "view does not exist: " + viewName);
        return HtmlViews.views[viewName];
    }

}
