import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function PriceChart({ data, currentPrice }) {
  // data 형식: [{ date: "11-01", price: 135000 }, ...]
  
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(
    prices.reduce((a, b) => a + b, 0) / prices.length
  );

  // Y축 여유 공간 (위아래 5%)
  const yMin = Math.floor(minPrice * 0.95);
  const yMax = Math.ceil(maxPrice * 1.05);

  const formatPrice = (value) => `${(value / 1000).toFixed(0)}천원`;
  const formatTooltipPrice = (value) =>
    `${value.toLocaleString("ko-KR")}원`;

  return (
    <div className="price-chart-wrapper">
      <div className="chart-stats">
        <div className="stat-item">
          <span className="stat-label">최저가</span>
          <span className="stat-value low">
            {minPrice.toLocaleString("ko-KR")}원
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">평균가</span>
          <span className="stat-value">
            {avgPrice.toLocaleString("ko-KR")}원
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">최고가</span>
          <span className="stat-value high">
            {maxPrice.toLocaleString("ko-KR")}원
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12, fill: "#888" }}
            tickLine={false}
            axisLine={{ stroke: "#ddd" }}
          />
          <YAxis
            domain={[yMin, yMax]}
            tickFormatter={formatPrice}
            tick={{ fontSize: 12, fill: "#888" }}
            tickLine={false}
            axisLine={false}
            width={70}
          />
          <Tooltip
            formatter={(value) => [formatTooltipPrice(value), "가격"]}
            labelStyle={{ color: "#333", fontWeight: "bold" }}
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          />
          <ReferenceLine
            y={avgPrice}
            stroke="#999"
            strokeDasharray="4 4"
            label={{
              value: "평균",
              position: "right",
              fill: "#999",
              fontSize: 11,
            }}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#4079f2"
            strokeWidth={2.5}
            dot={{ fill: "#4079f2", r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}