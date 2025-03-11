import React, { useState, useEffect } from 'react';
import {
  Grid,
  Typography,
  Button,
  Box,
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const data = [
  { time: '07-01 23:30', price: 63150.59, vol: 10, ma5: 63135.401, ma10: 63105.951, ma20: 63063.941 },
  { time: '07-01 23:31', price: 63158.09, vol: 12, ma5: 63137.401, ma10: 63107.951, ma20: 63065.941 },
  { time: '07-01 23:32', price: 63147.19, vol: 15, ma5: 63139.401, ma10: 63109.951, ma20: 63067.941 },
  { time: '07-01 23:33', price: 63130.59, vol: 18, ma5: 63141.401, ma10: 63111.951, ma20: 63069.941 },
  { time: '07-01 23:34', price: 63138.09, vol: 20, ma5: 63143.401, ma10: 63113.951, ma20: 63071.941 },
  { time: '07-01 23:35', price: 63127.19, vol: 17, ma5: 63145.401, ma10: 63115.951, ma20: 63073.941 },
  { time: '07-01 23:36', price: 63140.59, vol: 19, ma5: 63147.401, ma10: 63117.951, ma20: 63075.941 },
  { time: '07-01 23:37', price: 63148.09, vol: 22, ma5: 63149.401, ma10: 63119.951, ma20: 63077.941 },
  { time: '07-01 23:38', price: 63137.19, vol: 21, ma5: 63151.401, ma10: 63121.951, ma20: 63079.941 },
  { time: '07-01 23:39', price: 63150.59, vol: 23, ma5: 63153.401, ma10: 63123.951, ma20: 63081.941 },
  { time: '07-01 23:40', price: 63158.09, vol: 25, ma5: 63155.401, ma10: 63125.951, ma20: 63083.941 },
  { time: '07-01 23:41', price: 63147.19, vol: 27, ma5: 63157.401, ma10: 63127.951, ma20: 63085.941 },
  { time: '07-01 23:42', price: 63130.59, vol: 29, ma5: 63159.401, ma10: 63129.951, ma20: 63087.941 },
  { time: '07-01 23:43', price: 63138.09, vol: 31, ma5: 63161.401, ma10: 63131.951, ma20: 63089.941 },
  { time: '07-01 23:44', price: 63127.19, vol: 33, ma5: 63163.401, ma10: 63133.951, ma20: 63091.941 },
  { time: '07-01 23:45', price: 63140.59, vol: 35, ma5: 63165.401, ma10: 63135.951, ma20: 63093.941 },
  { time: '07-01 23:46', price: 63148.09, vol: 37, ma5: 63167.401, ma10: 63137.951, ma20: 63095.941 },
  { time: '07-01 23:47', price: 63137.19, vol: 39, ma5: 63169.401, ma10: 63139.951, ma20: 63097.941 },
  { time: '07-01 23:48', price: 63150.59, vol: 41, ma5: 63171.401, ma10: 63141.951, ma20: 63099.941 },
  { time: '07-01 23:49', price: 63158.09, vol: 43, ma5: 63173.401, ma10: 63143.951, ma20: 63101.941 },
  { time: '07-01 23:50', price: 63147.19, vol: 45, ma5: 63175.401, ma10: 63145.951, ma20: 63103.941 },
  { time: '07-01 23:51', price: 63130.59, vol: 47, ma5: 63177.401, ma10: 63147.951, ma20: 63105.941 },
  { time: '07-01 23:52', price: 63138.09, vol: 49, ma5: 63179.401, ma10: 63149.951, ma20: 63107.941 },
  { time: '07-01 23:53', price: 63127.19, vol: 51, ma5: 63181.401, ma10: 63151.951, ma20: 63109.941 },
  { time: '07-01 23:54', price: 63140.59, vol: 53, ma5: 63183.401, ma10: 63153.951, ma20: 63111.941 },
  { time: '07-01 23:55', price: 63148.09, vol: 55, ma5: 63185.401, ma10: 63155.951, ma20: 63113.941 },
  { time: '07-01 23:56', price: 63137.19, vol: 57, ma5: 63187.401, ma10: 63157.951, ma20: 63115.941 },
  { time: '07-01 23:57', price: 63150.59, vol: 59, ma5: 63189.401, ma10: 63159.951, ma20: 63117.941 },
  { time: '07-01 23:58', price: 63158.09, vol: 61, ma5: 63191.401, ma10: 63161.951, ma20: 63119.941 },
  { time: '07-01 23:59', price: 63147.19, vol: 63, ma5: 63193.401, ma10: 63163.951, ma20: 63121.941 },
  { time: '07-02 00:00', price: 63130.59, vol: 65, ma5: 63195.401, ma10: 63165.951, ma20: 63123.941 },
  { time: '07-02 00:01', price: 63138.09, vol: 67, ma5: 63197.401, ma10: 63167.951, ma20: 63125.941 },
  { time: '07-02 00:02', price: 63127.19, vol: 69, ma5: 63199.401, ma10: 63169.951, ma20: 63127.941 },
  { time: '07-02 00:03', price: 63140.59, vol: 71, ma5: 63201.401, ma10: 63171.951, ma20: 63129.941 },
  { time: '07-02 00:04', price: 63148.09, vol: 73, ma5: 63203.401, ma10: 63173.951, ma20: 63131.941 },
  { time: '07-02 00:05', price: 63137.19, vol: 75, ma5: 63205.401, ma10: 63175.951, ma20: 63133.941 },
  { time: '07-02 00:06', price: 63150.59, vol: 77, ma5: 63207.401, ma10: 63177.951, ma20: 63135.941 },
  { time: '07-02 00:07', price: 63158.09, vol: 79, ma5: 63209.401, ma10: 63179.951, ma20: 63137.941 },
  { time: '07-02 00:08', price: 63147.19, vol: 81, ma5: 63211.401, ma10: 63181.951, ma20: 63139.941 },
  { time: '07-02 00:09', price: 63130.59, vol: 83, ma5: 63213.401, ma10: 63183.951, ma20: 63141.941 },
  { time: '07-02 00:10', price: 63138.09, vol: 85, ma5: 63215.401, ma10: 63185.951, ma20: 63143.941 },
  { time: '07-02 00:11', price: 63127.19, vol: 87, ma5: 63217.401, ma10: 63187.951, ma20: 63145.941 },
  { time: '07-02 00:12', price: 63140.59, vol: 89, ma5: 63219.401, ma10: 63189.951, ma20: 63147.941 },
  { time: '07-02 00:13', price: 63148.09, vol: 91, ma5: 63221.401, ma10: 63191.951, ma20: 63149.941 },
  { time: '07-02 00:14', price: 63137.19, vol: 93, ma5: 63223.401, ma10: 63193.951, ma20: 63151.941 },
  { time: '07-02 00:15', price: 63150.59, vol: 95, ma5: 63225.401, ma10: 63195.951, ma20: 63153.941 },
];

const TradeTest = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1M');
  const [selectedInterval, setSelectedInterval] = useState('1');

  useEffect(() => {
    // Fetch data based on selected timeframe and interval
    // ...
  }, [selectedTimeframe, selectedInterval]);

  return (
    <Container >
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card >
            <CardContent>
              <Typography variant="h6">BTC/USDT</Typography>
              <Typography variant="h4">63170.71</Typography>
              <Typography variant="body1">50.78 0.08%</Typography>
              <Box mt={2}>
                <Typography variant="subtitle1">Opening</Typography>
                <Typography variant="body1">63119.93</Typography>
                <Typography variant="subtitle1">Lowest</Typography>
                <Typography variant="body1">62787.86</Typography>
              </Box>
              <Box mt={2}>
                <Typography variant="subtitle1">Volume</Typography>
                <Typography variant="body1">0.15M</Typography>
                <Typography variant="subtitle1">Highest</Typography>
                <Typography variant="body1">63831.10</Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card >
            <CardContent>
              <Typography variant="h6">Timeframe</Typography>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="timeframe-select-label">Timeframe</InputLabel>
                <Select
                  labelId="timeframe-select-label"
                  id="timeframe-select"
                  value={selectedTimeframe}
                  onChange={(e) => setSelectedTimeframe(e.target.value)}
                  label="Timeframe"
                >
                  <MenuItem value="1M">1M</MenuItem>
                  <MenuItem value="5M">5M</MenuItem>
                  <MenuItem value="15M">15M</MenuItem>
                  <MenuItem value="30M">30M</MenuItem>
                  <MenuItem value="1H">1H</MenuItem>
                  <MenuItem value="1D">1D</MenuItem>
                  <MenuItem value="7D">7D</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card >
            <CardContent>
              <Box >
                <LineChart
                  width={1000}
                  height={400}
                  data={data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="time" />
                  <YAxis />
                  <CartesianGrid stroke="#f5f5f5" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="ma5" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="ma10" stroke="#ffc658" />
                  <Line type="monotone" dataKey="ma20" stroke="#ff7300" />
                </LineChart>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card >
            <CardContent>
              <Typography variant="h6">Volume</Typography>
              <Typography variant="body1">VOL(5,10) VOL:16 →</Typography>
              <Typography variant="body1">MA5:71 MA10:10 →</Typography>
              {/* Display volume chart here */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card >
            <CardContent>
              <Typography variant="h6">MACD</Typography>
              <Typography variant="body1">MACD(12,26,9) DIF:34.101 DEA:23.931 MACD:20.341 →</Typography>
              {/* Display MACD chart here */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary">
            Long
          </Button>
          <Button variant="contained" color="secondary">
            Short
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default TradeTest;