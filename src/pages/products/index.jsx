import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
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
import axios from "axios";
import { baseUrl } from "../../apis/baseUrl";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import BootstrapDialog, { BootstrapDialogTitle } from "../../components/Dialog";

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

const Products = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(undefined);
  const [selectedFile, setSelectedFile] = useState(undefined);
  const [preview, setPreview] = useState(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    axios
      .get(`${baseUrl}/products/`)
      .then((res) => {
        setProducts(res.data);
      })
      .catch((e) => console.log(e));
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleClickOpen = (product) => {
    setDialogOpen(true);
    setEditingProduct(product);
  };
  const handleClose = () => {
    setDialogOpen(false);
    setEditingProduct(undefined);
  };

  const updateEditingProduct = (key, value) => {
    setEditingProduct((prev) => {
      const product = structuredClone(prev);
      product[key] = value;
      return product;
    });
  };

  const handleSubmitUpdate = () => {
    if (!editingProduct) return;
    const { name, cost, description, productCategory } = editingProduct;
    const payload = {
      productDto: { name, cost, description, productCategory },
      file: selectedFile,
    };
    console.log(payload);
    axios.post(`${baseUrl}/products/update/${editingProduct.id}`, payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  return (
    <Container component="main" maxWidth="lg">
      {editingProduct && (
        <BootstrapDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={dialogOpen}>
          <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
            Cập nhật thông tin sản phẩm
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <Box minWidth={500} component="form" display="flex" flexDirection="column" gap={2}>
              <TextField
                fullWidth
                error={!editingProduct.name}
                label="Tên sản phẩm"
                value={editingProduct.name}
                onChange={(e) => updateEditingProduct("name", e.target.value)}
              />
              <TextField
                fullWidth
                type="number"
                error={!editingProduct.cost}
                label="Giá sản phẩm (ngàn đồng)"
                value={editingProduct.cost}
                onChange={(e) => updateEditingProduct("cost", e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                error={!editingProduct.description}
                label="Mô tả sản phẩm"
                value={editingProduct.description}
                onChange={(e) => updateEditingProduct("description", e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Phân loại sản phẩm</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={editingProduct.productCategory}
                  label="Phân loại sản phẩm"
                  onChange={(e) => updateEditingProduct("productCategory", e.target.value)}
                >
                  <MenuItem value={"CAKE"}>Bánh ngọt</MenuItem>
                  <MenuItem value={"TEA"}>Trà</MenuItem>
                  <MenuItem value={"FRUIT_JUICE"}>Nước ép</MenuItem>
                  <MenuItem value={"COFFEE"}>Cà phê</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Button sx={{ mt: 2 }} variant="outlined" component="label" endIcon={<PhotoCamera />}>
              Hình ảnh sản phẩm
              <input hidden accept="image/*" type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
            </Button>
            {selectedFile && (
              <Box mt={2}>
                <img src={preview} style={{ maxWidth: 300 }} />
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button autoFocus disabled={!selectedFile} onClick={handleSubmitUpdate}>
              Lưu
            </Button>
            <Button autoFocus onClick={handleClose}>
              Quay lại
            </Button>
          </DialogActions>
        </BootstrapDialog>
      )}
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Danh sách sản phẩm
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Box mb={2} display="flex" justifyContent="flex-end">
            <Button variant="outlined" startIcon={<AddIcon />}>
              Thêm sản phẩm
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>STT</TableCell>
                  <TableCell>Tên sản phẩm</TableCell>
                  <TableCell>Hình ảnh</TableCell>
                  <TableCell>Mô tả</TableCell>
                  <TableCell>Giá sản phẩm</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((product, index) => (
                  <TableRow key={product.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      {/* <Link to={`/products/${product.id}`}> */}
                      {product.name}
                      {/* </Link> */}
                    </TableCell>
                    <TableCell>
                      <img width={120} src={product.image} />
                    </TableCell>
                    <TableCell width={400}>{product.description}</TableCell>
                    <TableCell>{product.cost * 1000} VND</TableCell>
                    <TableCell>
                      <IconButton color="primary" aria-label="upload picture" component="label" onClick={() => handleClickOpen(product)}>
                        <EditIcon />
                      </IconButton>
                      <IconButton color="primary" aria-label="upload picture" component="label">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
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

export default Products;
