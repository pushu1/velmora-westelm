@extends('layouts.admin')

@section('title', 'Executive Analytics')
@section('header_title', 'Dashboard Overview')

@section('styles')
<style>
    /* Metric Cards Grid */
    .metrics-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 30px;
        margin-bottom: 40px;
    }

    .metric-card {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    }

    .metric-card::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background-color: var(--charcoal);
        transform: scaleX(0);
        transition: transform 0.3s ease;
    }

    .metric-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.03);
    }

    .metric-card:hover::after {
        transform: scaleX(1);
    }

    .metric-label {
        font-size: 13px;
        text-transform: uppercase;
        color: var(--dark-grey);
        letter-spacing: 0.05em;
        margin-bottom: 12px;
    }

    .metric-value {
        font-family: 'Outfit', sans-serif;
        font-size: 32px;
        font-weight: 700;
        color: var(--charcoal);
    }

    .metric-change {
        font-size: 12px;
        margin-top: 10px;
        display: flex;
        align-items: center;
        gap: 4px;
    }

    .metric-change.positive { color: var(--success); }
    .metric-change.negative { color: var(--error); }

    /* Visual Charts Grid */
    .charts-grid {
        display: grid;
        grid-template-columns: 2fr 1fr;
        gap: 30px;
        margin-bottom: 40px;
    }

    .chart-card {
        background-color: white;
        border: 1px solid var(--soft-grey);
        border-radius: 4px;
        padding: 30px;
    }

    .chart-card-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--charcoal);
        margin-bottom: 24px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid var(--warm-ivory);
        padding-bottom: 14px;
    }

    .chart-card-title span {
        font-size: 12px;
        color: var(--dark-grey);
        font-weight: 400;
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .chart-full-grid {
        grid-template-columns: 1fr;
    }

    @media (max-width: 1200px) {
        .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        .charts-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 600px) {
        .metrics-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
@endsection

@section('content')
<!-- Core aggregations -->
<div class="metrics-grid">
    <div class="metric-card">
        <div>
            <div class="metric-label">Total Revenue</div>
            <div class="metric-value">₹{{ number_format($totalRevenue, 2) }}</div>
        </div>
        <div class="metric-change positive">
            <svg fill="none" stroke="currentColor" width="14" height="14" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            <span>+12.4% vs last month</span>
        </div>
    </div>
    
    <div class="metric-card">
        <div>
            <div class="metric-label">Completed Orders</div>
            <div class="metric-value">{{ number_format($totalOrders) }}</div>
        </div>
        <div class="metric-change positive">
            <svg fill="none" stroke="currentColor" width="14" height="14" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            <span>+8.2% vs last month</span>
        </div>
    </div>

    <div class="metric-card">
        <div>
            <div class="metric-label">User Registrations</div>
            <div class="metric-value">{{ number_format($totalUsers) }}</div>
        </div>
        <div class="metric-change positive">
            <svg fill="none" stroke="currentColor" width="14" height="14" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            <span>+15.1% acquisition scale</span>
        </div>
    </div>

    <div class="metric-card">
        <div>
            <div class="metric-label">Catalog Products</div>
            <div class="metric-value">{{ number_format($totalProducts) }}</div>
        </div>
        <div class="metric-change">
            <span>Freshly synced catalog items</span>
        </div>
    </div>
</div>

<!-- Charts Grid -->
<div class="charts-grid">
    <div class="chart-card">
        <div class="chart-card-title">
            Revenue Tracker
            <span>Daily aggregations (last 30 days)</span>
        </div>
        <div id="revenue-chart" style="min-height: 350px;"></div>
    </div>

    <div class="chart-card">
        <div class="chart-card-title">
            Top Categories
            <span>Sales Distribution volume</span>
        </div>
        <div id="category-chart" style="min-height: 350px; display: flex; align-items: center; justify-content: center;"></div>
    </div>
</div>

<div class="charts-grid chart-full-grid">
    <div class="chart-card">
        <div class="chart-card-title">
            User Acquisition Scalability
            <span>Signup Distributions</span>
        </div>
        <div id="acquisition-chart" style="min-height: 300px;"></div>
    </div>
</div>
@endsection

@section('scripts')
<!-- Load ApexCharts CDN -->
<script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // Theme Colors
        const CHARCOAL = '#222222';
        const CLAY = '#C07A65';
        const SOFT_GREY = '#E5E5E5';
        
        // 1. Revenue Line Chart options
        const revenueOptions = {
            chart: {
                type: 'area',
                height: 350,
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif'
            },
            dataLabels: { enabled: false },
            stroke: {
                curve: 'smooth',
                width: 3,
                colors: [CLAY]
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    opacityFrom: 0.35,
                    opacityTo: 0.05,
                    colorStops: [
                        { offset: 0, color: CLAY, opacity: 0.35 },
                        { offset: 100, color: '#FFFFFF', opacity: 0.05 }
                    ]
                }
            },
            series: [{
                name: 'Revenue (₹)',
                data: {!! json_encode($revenueValues) !!}
            }],
            xaxis: {
                categories: {!! json_encode($revenueLabels) !!},
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            yaxis: {
                labels: {
                    formatter: function(val) { return '₹' + val.toLocaleString(); }
                }
            },
            grid: {
                borderColor: '#F1F1F1',
                strokeDashArray: 4
            },
            tooltip: {
                theme: 'dark',
                y: {
                    formatter: function(val) { return '₹' + val.toLocaleString(); }
                }
            }
        };
        const revenueChart = new ApexCharts(document.querySelector("#revenue-chart"), revenueOptions);
        revenueChart.render();

        // 2. Category Pie/Donut Chart options
        const categoryOptions = {
            chart: {
                type: 'donut',
                height: 320,
                fontFamily: 'Inter, sans-serif'
            },
            stroke: { show: false },
            labels: {!! json_encode($categoryLabels) !!},
            series: {!! json_encode($categoryValues) !!},
            colors: [CHARCOAL, CLAY, '#A88C7D', '#E2D1C3', '#D5C4B4'],
            legend: {
                position: 'bottom',
                fontSize: '12px'
            },
            dataLabels: { enabled: false },
            plotOptions: {
                pie: {
                    donut: {
                        size: '75%',
                        labels: {
                            show: true,
                            total: {
                                show: true,
                                label: 'Total Volume',
                                fontFamily: 'Outfit, sans-serif',
                                fontSize: '13px',
                                formatter: function (w) {
                                    return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                }
                            }
                        }
                    }
                }
            },
            tooltip: {
                theme: 'dark'
            }
        };
        const categoryChart = new ApexCharts(document.querySelector("#category-chart"), categoryOptions);
        categoryChart.render();

        // 3. User Acquisition Bar Chart
        const acquisitionOptions = {
            chart: {
                type: 'bar',
                height: 300,
                toolbar: { show: false },
                fontFamily: 'Inter, sans-serif'
            },
            plotOptions: {
                bar: {
                    borderRadius: 4,
                    columnWidth: '50%',
                    colors: {
                        backgroundBarColors: ['#FAF9F6'],
                        backgroundBarOpacity: 1
                    }
                }
            },
            series: [{
                name: 'New Signups',
                data: {!! json_encode($acquisitionValues) !!}
            }],
            colors: [CHARCOAL],
            xaxis: {
                categories: {!! json_encode($acquisitionLabels) !!},
                axisBorder: { show: false },
                axisTicks: { show: false }
            },
            grid: {
                borderColor: '#F1F1F1',
                strokeDashArray: 4
            },
            tooltip: {
                theme: 'dark'
            }
        };
        const acquisitionChart = new ApexCharts(document.querySelector("#acquisition-chart"), acquisitionOptions);
        acquisitionChart.render();
    });
</script>
@endsection
