import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { baseUrl } from "../../apis/baseUrl";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TableContainer,
  TextField,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import MuiTableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import MuiTableRow from "@mui/material/TableRow";
import styled from "@emotion/styled";

const TableCell = styled(MuiTableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#361500",
    color: theme.palette.common.white,
    fontSize: 16,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const TableRow = styled(MuiTableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const FilterType = {
  ALL: 0,
  PAYPAL: 1,
  CASH: 2,
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [displayingOrders, setDisplayingOrders] = useState([]);
  const [filter, setFilter] = useState(FilterType.ALL);

  useEffect(() => {
    axios
      .get(`${baseUrl}/order/get_list_all_order`)
      .then((res) => {
        console.log(res.data.data);
        if (Array.isArray(res.data.data)) setOrders(res.data.data);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    setDisplayingOrders(orders);
  }, [orders]);

  useEffect(() => {
    console.log("filter", filter);
    const newDisplayingOrders = orders.filter((order) => {
      switch (filter) {
        case FilterType.ALL:
          return true;
        case FilterType.CASH:
          return String(order.paymentMethod).toLowerCase() === "cash";
        case FilterType.PAYPAL:
          return String(order.paymentMethod).toLowerCase() === "paypal";
      }
    });
    setDisplayingOrders(newDisplayingOrders);
  }, [filter, orders]);

  const handleViewDetailClick = (orderId) => {
    setDisplayingOrders((displayingOrders) => {
      return displayingOrders.map((order) => {
        if (order.id === orderId) {
          return { ...order, isShowingDetail: true };
        }
        return order;
      });
    });
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Danh sách đơn hàng
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã đơn hàng</TableCell>
                  <TableCell>Thông tin</TableCell>
                  <TableCell>Danh sách mặt hàng</TableCell>
                  <TableCell>Ngày đặt</TableCell>
                  <TableCell>Trạng thái</TableCell>
                  <TableCell>
                    <Typography>Phương thức thanh toán</Typography>
                    <Typography>
                      {(function (filter) {
                        switch (filter) {
                          case FilterType.ALL:
                            return "(tất cả)";
                          case FilterType.CASH:
                            return "(tiền mặt)";
                          case FilterType.PAYPAL:
                            return "(paypal)";
                        }
                      })(filter)}
                      <IconButton
                        sx={{ ml: 1 }}
                        color="primary"
                        component="label"
                        onClick={() => setFilter((filter) => (filter + 1) % Object.keys(FilterType).length)}
                      >
                        <FilterAltIcon />
                      </IconButton>
                    </Typography>
                  </TableCell>
                  {/* <TableCell></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {displayingOrders.map((order) => (
                  <TableRow key={order.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell width={80}>{order.id}</TableCell>
                    <TableCell width={200}>
                      <Typography>Họ và tên: {order.receiver_name}</Typography>
                      <Typography>Số điện thoại: {order.receiver_phone}</Typography>
                      <Typography>Địa chỉ: {order.address.address}</Typography>
                    </TableCell>
                    <TableCell width={400}>
                      <Typography>Tổng: {order.total} VND</Typography>
                      {!order.isShowingDetail && (
                        <Button size="small" onClick={() => handleViewDetailClick(order.id)}>
                          Xem chi tiết
                        </Button>
                      )}
                      <table hidden={!order.isShowingDetail} border={0} cellSpacing={2} cellPadding={2} width="100%">
                        <thead>
                          <tr>
                            <th>Sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th>Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.order_items.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <img width={40} src={item.product.imageLink} />
                                <Typography>{String(item.product.name)}</Typography>
                              </td>
                              <td>
                                <Typography>{item.product.cost ?? 0}</Typography>
                              </td>
                              <td>
                                <Typography>{item.product.quantity ?? 0}</Typography>
                              </td>
                              <td>
                                <Typography>{(item.product.quantity ?? 0) * (item.product.cost ?? 0)}</Typography>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </TableCell>
                    <TableCell>{order.time_order}</TableCell>
                    <TableCell>{order.status}</TableCell>
                    <TableCell width={160}>{order.paymentMethod}</TableCell>
                    {/* <TableCell>
                      <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => handleClickOpen(order)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="primary" aria-label="upload picture" component="label">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default Orders;
