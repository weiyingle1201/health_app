# 健康管理应用 API 文档

## 基础信息
- **基础URL**: `/api/v1`
- **请求方式**: REST API
- **数据格式**: JSON
- **认证方式**: Bearer Token

---

## 1. 用户认证模块

### 1.1 用户注册
**Endpoint**: `POST /auth/register`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| password | string | 是 | 密码 |
| verificationCode | string | 是 | 验证码 |

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "token": "string",
        "userId": "string"
    },
    "message": "注册成功"
}
```

---

### 1.2 用户登录
**Endpoint**: `POST /auth/login`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 手机号/账号 |
| password | string | 是 | 密码 |
| remember | boolean | 否 | 是否记住登录 |

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "token": "string",
        "userId": "string",
        "userInfo": {
            "nickname": "string",
            "avatar": "string"
        }
    },
    "message": "登录成功"
}
```

---

### 1.3 发送验证码
**Endpoint**: `POST /auth/verification-code`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| type | string | 是 | 验证码类型：register/reset |

#### 响应数据
```json
{
    "code": 200,
    "message": "验证码已发送"
}
```

---

### 1.4 重置密码
**Endpoint**: `POST /auth/reset-password`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| verificationCode | string | 是 | 验证码 |
| newPassword | string | 是 | 新密码 |

#### 响应数据
```json
{
    "code": 200,
    "message": "密码重置成功"
}
```

---

## 2. 目标管理模块

### 2.1 设置用户目标
**Endpoint**: `POST /goals/set`

#### 请求参数（示例）
```json
{
    "goalDTO": {
        "type": "exercise",
        "status": "active",
        "startDate": "2025-05-01T00:00:00",
        "endDate": "2025-06-01T00:00:00"
    },
    "goalDetailDTO": {
        "daysPerWeek": 5,
        "durationPerDay": 45,
        "dietType": "lose",
        "targetCalories": 2000,
        "moodTrackingEnabled": 1,
        "meditationTime": "10:00"
    }
}
```

#### 响应数据
```json
{
    "success": true,
    "data": 12,
    "code": 200,
    "message": "目标设置成功"
}
```

---

### 2.2 获取用户目标
**Endpoint**: `GET /goals`

#### 响应数据
```json
{
    "success": true,
    "data": {
        "goal": [
            {
                "id": 5,
                "userId": 9,
                "type": "exercise",
                "status": "active",
                "startDate": "2025-04-30T16:00:00.000+00:00",
                "endDate": "2025-05-31T16:00:00.000+00:00",
                "createdAt": "2025-05-09T17:39:21"
            },
            {
                "id": 6,
                "userId": 9,
                "type": "exercise",
                "status": "active",
                "startDate": "2025-04-30T16:00:00.000+00:00",
                "endDate": "2025-05-31T16:00:00.000+00:00",
                "createdAt": "2025-05-09T17:42:39"
            }
        ],
        "goalDetails": [
            {
                "id": 1,
                "goalId": 5,
                "daysPerWeek": 5,
                "durationPerDay": 45,
                "dietType": "lose",
                "targetCalories": 2000,
                "moodTrackingEnabled": 1,
                "meditationTime": "10:00",
                "createdAt": "2025-05-09T17:39:21"
            },
            {
                "id": 2,
                "goalId": 6,
                "daysPerWeek": 5,
                "durationPerDay": 45,
                "dietType": "lose",
                "targetCalories": 2000,
                "moodTrackingEnabled": 1,
                "meditationTime": "10:00",
                "createdAt": "2025-05-09T17:42:39"
            }
        ]
    },
    "code": 200,
    "message": "目标获取成功"
}
```

---

## 3. 打卡记录模块

### 3.1 提交打卡
**Endpoint**: `POST /checkins`

#### 请求参数
```json
{
    "type": "string",
    "data": {
        "exerciseType": "string",
        "duration": "number",
        "intensity": "string",
        "calories": "number",
        "meals": [{
            "type": "string",
            "time": "string",
            "foods": ["string"],
            "calories": "number"
        }],
        "mood": "number",
        "notes": "string"
    },
    "timestamp": "string"
}
```

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "checkinId": "string",
        "streakDays": "number"
    },
    "message": "打卡成功"
}
```

---

### 3.2 获取打卡历史
**Endpoint**: `GET /checkins`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 否 | 打卡类型 |
| startDate | string | 否 | 开始日期 |
| endDate | string | 否 | 结束日期 |

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "checkins": [{
            "id": "string",
            "type": "string",
            "data": "object",
            "timestamp": "string"
        }],
        "statistics": {
            "totalCount": "number",
            "streakDays": "number"
        }
    }
}
```

---

## 4. 数据统计模块

### 4.1 获取健康数据统计
**Endpoint**: `GET /stats`

#### 查询参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| type | string | 是 | 统计类型 |
| period | string | 是 | 统计周期：day/week/month |

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "summary": {
            "total": "number",
            "average": "number",
            "best": "number"
        },
        "trend": [{
            "date": "string",
            "value": "number"
        }]
    }
}
```

---

## 5. 用户信息模块

### 5.1 更新用户信息
**Endpoint**: `PUT /user/profile`

#### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| nickname | string | 否 | 昵称 |
| avatar | string | 否 | 头像 |
| gender | string | 否 | 性别 |
| birthday | string | 否 | 生日 |
| height | number | 否 | 身高 |
| weight | number | 否 | 体重 |

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "userInfo": "object"
    },
    "message": "信息更新成功"
}
```

---

### 5.2 获取用户信息
**Endpoint**: `GET /user/profile`

#### 响应数据
```json
{
    "code": 200,
    "data": {
        "userInfo": {
            "userId": "string",
            "nickname": "string",
            "avatar": "string",
            "gender": "string",
            "birthday": "string",
            "height": "number",
            "weight": "number",
            "joinDate": "string"
        }
    }
}
```

---

## 错误码说明
| 错误码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 401 | 未授权/token失效 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 注意事项
1. 所有请求需要在 header 中携带 token:
   ```
   Authorization: Bearer <token>
   ```
2. 日期格式统一使用 ISO 8601 标准:
   ```
   YYYY-MM-DDTHH:mm:ss.sssZ
   ```
3. 文件上传接口（如头像上传）使用 `multipart/form-data` 格式
4. 所有接口返回格式统一为：
   ```json
   {
       "code": "number",
       "data": "object",
       "message": "string"
   }
   ```
```