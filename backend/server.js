const mysql = require('mysql');
const exp = require("express");
const app = exp();
var cors = require('cors');
const fs = require("fs");
const jwt = require("jsonwebtoken");
const PRIVATE_KEY = fs.readFileSync("private-key.txt");

app.use( [ cors() , exp.json() ] );
const db = mysql.createConnection({
   host:'localhost', user:'root', password:'', port:3306, database:'shoes'
}); 
db.connect( err => {
    if (err) {
        console.error('Lỗi kết nối database:', err);
        throw err;
    } 
    console.log('Da ket noi database');
});


// nơi định nghĩa các đường route

app.listen(3000, () => 
    console.log(`Ung dung dang chay voi port 3000`),
    console.log(`http://localhost:3000/splist`)
);

// ------------------KHÁCH HÀNG----------------------
// SẢN PHẨM LIST
app.get('/splist/:sosp?', function(req, res) {
    let sosp = parseInt(req.params.sosp || 6);
    if (sosp <= 1) sosp = 6;
    let sql = `SELECT id, ten_sp, gia, gia_km, img, ngay, view
               FROM sanpham LIMIT ?`;
    db.query(sql,  [sosp],  (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi lấy list sp", "error": err});
        } else {
            res.json(data);
        }
    });
});
// SẢN PHẨM XEM NHIỀU
app.get('/spxn/:sosp?', function(req, res) {
    let sosp = parseInt(req.params.sosp || 6);
    if (sosp <= 1) sosp = 6;
    let sql = `SELECT id, ten_sp, gia, gia_km, img, ngay, view
               FROM sanpham  ORDER BY view DESC LIMIT 0, ?`;
    db.query(sql, sosp, (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi lấy list sp", "error": err});
        } else {
            res.json(data);
        }
    });
});

// LẤY 1 SẢN PHẨM 
app.get('/sp/:id', function(req, res) {
    let id = parseInt(req.params.id || 0);
    if (isNaN(id) || id <= 0) {
        res.json({"thong bao": "Không biết sản phẩm", "id": id});
        return;
    }
    let sql = `SELECT id, ten_sp, gia, gia_km, img, ngay, view
               FROM sanpham WHERE id = ?`;
    db.query(sql, id, (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi lấy 1 sp", "error": err});
        } else {
            res.json(data[0]);
        }
    });
});

// SẢN PHẨM TRONG DM
app.get('/spdm/:iddm', function(req, res) {
    let iddm = parseInt(req.params.iddm);
    if (isNaN(iddm) || iddm <= 0) {
        res.json({"thong bao": "Không biết loại", "iddm": iddm});
        return;
    }
    let sql = `SELECT id, ten_sp, gia, gia_km, img, ngay
               FROM sanpham WHERE iddm = ?  ORDER BY id DESC`;
    db.query(sql, iddm, (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi lấy sp trong dm", "error": err});
        } else {
            res.json(data);
        }
    });
});

// LẤY SẢN PHẨM LIÊN QUAN
app.get('/splienquan/:id', function(req, res) {
    let id = parseInt(req.params.id || 0);
    if (isNaN(id) || id <= 0) {
        res.json({"thongbao": "Không biết sản phẩm", "id": id});
        return;
    }
    // Lấy iddm của sản phẩm hiện tại
    let sql = `SELECT iddm FROM sanpham WHERE id = ?`;
    db.query(sql, id, (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi lấy loại sản phẩm", "error": err});
        } else {
            let iddm = data[0].iddm;
            let sql_lq = `SELECT id, ten_sp, gia, gia_km, img, ngay 
                          FROM sanpham WHERE iddm = ? AND id != ?  ORDER BY ngay DESC LIMIT 0, 4`;
            db.query(sql_lq, [iddm, id], (err, data_lq) => {
                if (err) {
                    res.json({"thongbao": "Lỗi lấy sản phẩm liên quan", "error": err});
                } else {
                    res.json(data_lq);
                }
            });
        }
    });
});


// DANH MỤC
app.get('/dm', function(req, res) {
    let sql = `SELECT id, tendm, img FROM danhmuc`;
    db.query(sql, (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi lấy danh mục", "error": err});
        } else {
            res.json(data);
        }
    });
});

// ADMIN THÊM DANH MỤC
app.post('/admin/dm', function(req, res) {
    // Lấy dữ liệu từ body của request
    let data = req.body;

    // Kiểm tra xem tên danh mục có được cung cấp không
    if (!data.tendm) {
        return res.status(400).json({ thongbao: 'Vui lòng cung cấp tên danh mục' });
    }

    // Câu lệnh SQL để thêm danh mục
    let sql = 'INSERT INTO danhmuc SET ?'; 

    // Thực hiện truy vấn
    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Lỗi khi chèn danh mục:', err); // Ghi lại lỗi thực tế
            return res.status(500).json({ thongbao: 'Lỗi thêm danh mục', error: err });
        }
        res.status(201).json({ thongbao: 'Đã thêm danh mục', id: result.insertId });
    });
});

// ADMIN XÓA DANH MỤC
app.delete('/admin/dm/:id', function(req, res) {
    // Lấy ID danh mục từ tham số của request
    const id = req.params.id;

    // Kiểm tra xem ID có hợp lệ không
    if (!id) {
        return res.status(400).json({ thongbao: 'Vui lòng cung cấp ID danh mục' });
    }

    // Câu lệnh SQL để xóa danh mục theo ID
    let sql = 'DELETE FROM danhmuc WHERE id = ?';

    // Thực hiện truy vấn
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Lỗi khi xóa danh mục:', err); // Ghi lại lỗi thực tế
            return res.status(500).json({ thongbao: 'Lỗi xóa danh mục', error: err });
        }
        
        // Kiểm tra xem có danh mục nào bị xóa không
        if (result.affectedRows === 0) {
            return res.status(404).json({ thongbao: 'Không tìm thấy danh mục để xóa' });
        }

        res.status(200).json({ thongbao: 'Đã xóa danh mục' });
    });
});





// LƯU ĐƠN HÀNG
app.post('/luudonhang/', function (req, res) {
    let data = req.body;
    let sql = `INSERT INTO donhang SET ?`;
    
    db.query(sql, data, function(err, result) {
        if (err) {
            console.error('Error saving order:', err);
            res.status(500).json({"id": -1, "thongbao": "Lỗi lưu đơn hàng", "error": err});
        } else {
            let id = result.insertId;
            res.json({"id": id, "thongbao": "Đã lưu đơn hàng"});
        }
    });
});

// LƯU CTĐH
app.post('/luuctdh/', function (req, res) {
    let data = req.body;
    let sql = `INSERT INTO ctdh SET ?`;

    db.query(sql, data, function(err, result) {
        if (err) {
            console.error('Error saving cart item:', err);
            res.status(500).json({"thongbao": "Lỗi lưu sản phẩm", "error": err});
        } else {
            res.json({"thongbao": "Đã lưu sản phẩm vào ctdh", "id_sp": data.id_sp});
        }
    });
});
// LƯU GIỎ HÀNG
app.post('/luugiohang/', function (req, res) {
    let data = req.body;
    let sql = `INSERT INTO giohang SET ?`;
    
    db.query(sql, data, function(err, result) {
        if (err) {
            console.error('Error saving order:', err);
            res.status(500).json({"id": -1, "thongbao": "Lỗi lưu giỏ hàng", "error": err});
        } else {
            let id = result.insertId;
            res.json({"id": id, "thongbao": "Đã lưu giỏ hàng"});
        }
    });
});

// LƯU CTGH
app.post('/luuctgh/', function (req, res) {
    let data = req.body;
    let sql = `INSERT INTO ctgh SET ?`;

    db.query(sql, data, function(err, result) {
        if (err) {
            console.error('Error saving cart item:', err);
            res.status(500).json({"thongbao": "Lỗi lưu sản phẩm", "error": err});
        } else {
            res.json({"thongbao": "Đã lưu sản phẩm vào ctgh", "id_sp": data.id_sp});
        }
    });
});

// TÌM KIẾM SẢN PHẨM
app.get('/timkiem', function(req, res) {
    let keyword = req.query.q;
    if (!keyword) {
        res.json({"thongbao": "Vui lòng nhập từ khóa tìm kiếm"});
        return;
    }
    let sql = `SELECT id, ten_sp, gia, gia_km, img, ngay
               FROM sanpham WHERE ten_sp LIKE ? ORDER BY ngay DESC`;
    db.query(sql, [`%${keyword}%`], (err, data) => {
        if (err) {
            res.json({"thongbao": "Lỗi tìm kiếm sản phẩm", "error": err});
        } else {
            res.json(data);
        }
    });
});

// ------------------USER----------------------
// ADMIN SẢN PHẨM
app.get('/admin/sp', function (req, res) {
    let sql = `SELECT id, ten_sp, gia, img, ngay, view 
        FROM sanpham ORDER BY id asc ` ;
    db.query(sql, (err, data) => {
        if (err) res.json({"thongbao":"Lỗi lấy list sp", err }) 
        else res.json(data);
    });
    
});

// ADMIN SẢN PHẨM THEO ID
app.get('/admin/sp/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (id <= 0) {
    res.json({"thong bao":"Không biết sản phẩm", "id": id}); return;
    }
    let sql = 'SELECT * FROM sanpham WHERE id = ?'
    db.query(sql, id, (err, data) => {
        if (err) res.json({"thongbao":"Lỗi lấy 1 sp", err })
        else res.json(data[0]);
    });
});

// ADMIN THÊM SẢN PHẨM 
app.post('/admin/sp', function(req, res) {
    let data = req.body;
    let sql = 'INSERT INTO sanpham SET ?'; 
    db.query(sql, data, (err, result) => {
        if (err) {
            console.error('Lỗi khi chèn sản phẩm:', err); // Ghi lại lỗi thực tế
            return res.json({"thongbao":"Lỗi chèn 1 sp", err });
        }
        res.json({"thongbao":"Đã chèn 1 sp", "id": result.insertId });
    });
});



// ADMIN SỬA SẢN PHẨM 
app.put('/admin/sp/:id', function(req, res) {
    let data = req.body;
    let id= req.params.id;
    let sql = 'UPDATE sanpham SET? WHERE id = ?';
    db.query(sql, [data, id], (err, d) => {
        if (err) res.json({"thongbao":"Lỗi cập nhật sp", err }); 
        else res.json({"thongbao":"Đã cập nhật sp" });
    });
});

// ADMIN XÓA SẢN PHẨM 
app.delete('/admin/sp/:id', function(req, res) {
    let id = req.params.id;
    let sql = 'DELETE FROM sanpham WHERE id = ?'; 
    db.query(sql, id, (err, d) => {
        if (err) res.json({"thongbao":"Lỗi khi xóa sp", err }); 
        else res.json({"thongbao":"Đã xóa sp" });
    });
});


// ADMIN HIỂN THỊ USER
app.get('/admin/user', (req, res) => {
    const sql = ` SELECT id, ten, email, phone , diachi FROM user `;
    db.query(sql, (err, data) => {
      if (err) {
        console.error('Error fetching users:', err);
        return res.status(500).json({ thongbao: 'Lỗi lấy user', error: err });
      }
      res.json(data);
    });
  });
// ADMIN HIỂN THỊ KHÁCH HÀNG
app.get('/admin/khachhang', (req, res) => {
    const sql = ` SELECT id, ten, email, phone , dia_chi FROM khachhang `;
    db.query(sql, (err, data) => {
        if (err) {
        console.error('Error fetching khachhang:', err);
        return res.status(500).json({ thongbao: 'Lỗi lấy khachhang', error: err });
    }
    res.json(data);
    });
});

// ĐĂNG KÝ USER
app.post('/register', async (req, res) => {
    const { ten, email, password, phone } = req.body;
  
    // Kiểm tra nếu các trường cần thiết không được cung cấp
    if (!ten || !email || !password || !phone) {
      return res.status(400).json({ thongbao: 'Vui lòng điền đầy đủ thông tin' });
    }
  
    try {
  
      // Tạo người dùng mới
      const sql = `INSERT INTO user (ten, email, password, phone) VALUES (?, ?, ?, ?)`;
      db.query(sql, [ten, email, password, phone], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ thongbao: 'Lỗi đăng ký', error: err });
        }
        res.json({ thongbao: 'Đăng ký thành công', id: result.insertId });
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ thongbao: 'Lỗi máy chủ', error: err });
    }
  });

// ĐĂNG KÝ KHÁCH HÀNG
app.post('/registerKH', async (req, res) => {
    const { ten, email, password, phone } = req.body;
  
    // Kiểm tra nếu các trường cần thiết không được cung cấp
    if (!ten || !email || !password || !phone) {
      return res.status(400).json({ thongbao: 'Vui lòng điền đầy đủ thông tin' });
    }
  
    try {
  
      // Tạo người dùng mới
      const sql = `INSERT INTO khachhang (ten, email, password, phone) VALUES (?, ?, ?, ?)`;
      db.query(sql, [ten, email, password, phone], (err, result) => {
        if (err) {
          console.error('Error registering user:', err);
          return res.status(500).json({ thongbao: 'Lỗi đăng ký', error: err });
        }
        res.json({ thongbao: 'Đăng ký thành công', id: result.insertId });
      });
    } catch (err) {
      console.error('Error during registration:', err);
      res.status(500).json({ thongbao: 'Lỗi máy chủ', error: err });
    }
  });

// ĐĂNG NHẬP
app.post('/login', async (req, res) => {
    const { email, password } = req.body; 
    
    try {
      const userInfo = await checkUserPass(email, password);
      
      if (userInfo) {
        const jwtBearToken = jwt.sign({}, PRIVATE_KEY, {
          algorithm: 'RS256', // Sử dụng thuật toán RS256 để ký
          expiresIn: 120, // Mã thông báo hết hạn sau 120 giây
          subject: userInfo.id.toString() // Đặt subject là ID của người dùng
        });
        
        res.status(200).json({ token: jwtBearToken, expiresIn: 120, userInfo });
      } else {
        res.status(481).json({ thongbao: 'Đăng nhập thất bại' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ thongbao: 'Có lỗi xảy ra' });
    }
  });
  
// HÀM KIỂM TRA EMAIL & PASSWWORD
const checkUserPass = (email, password) => {
    return new Promise((resolve, reject) => {
        const queryUser = 'SELECT id, ten FROM user WHERE email = ? AND password = ?'; 
        const queryCustomer = 'SELECT id, ten FROM khachhang WHERE email = ? AND password = ?'; 

        db.query(queryUser, [email, password], (err, results) => {
            if (err) {
                return reject(err); 
            }
            if (results.length > 0) {
                return resolve(results[0]); 
            }

            db.query(queryCustomer, [email, password], (err, results) => {
                if (err) {
                    return reject(err); 
                }
                if (results.length > 0) {
                    return resolve(results[0]); 
                }
                resolve(null);
            });
        });
    });
};

  
// ADMIN DANH MỤC
  app.get('/admin/dm', function (req, res) {
    let sql = `SELECT id, tendm   FROM danhmuc ORDER BY id asc  ` ;
    db.query(sql, (err, data) => {
        if (err) res.json({"thongbao":"Lỗi lấy danh mục sản phẩm", err }) 
        else res.json(data);
    });
});

// ADMIN DANH MỤC THEO ID
app.get('/admin/dm/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (id <= 0) {
    res.json({"thong bao":"Không biết danh mục sản phẩm", "id": id}); return;
    }
    let sql = 'SELECT * FROM danhmuc WHERE id = ?'
    db.query(sql, id, (err, data) => {
        if (err) res.json({"thongbao":"Lỗi lấy 1 dm sp", err })
        else res.json(data[0]);
    });
});

// ADMIN THÊM DANH MỤC
app.post('/admin/dm', function(req, res) {
    let data = req.body;
    let sql = 'INSERT INTO danhmuc SET ?'; 
    db.query(sql, data, (err, data) => {
    if (err) res.json({"thongbao":"Lỗi chèn 1 dm sp", err });
    else res.json({"thongbao":"Đã chèn 1 dm sp", "id": data.insertId });
    });
});

// ADMIN SỬA DANH MỤC
app.put('/admin/dm/:id', function(req, res) {
    let data = req.body;
    let id= req.params.id;
    let sql = 'UPDATE danhmuc SET? WHERE id = ?';
    db.query(sql, [data, id], (err, d) => {
        if (err) res.json({"thongbao":"Lỗi cập nhật dm sp", err }); 
        else res.json({"thongbao":"Đã cập nhật dm sp" });
    });
});

// ADMIN XÓA DANH MỤC
app.delete('/admin/dm/:id', function(req, res) {
    let id= req.params.id;
    let sql = 'DELETE FROM danhmuc WHERE id = ?';
    db.query(sql, id, (err, d) => {
        if (err) res.json({"thongbao":"Lỗi khi xóa dm sp", err }); 
        else res.json({"thongbao":"Đã xóa dm sp" });
    });
});
