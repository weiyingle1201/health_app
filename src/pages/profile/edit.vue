<template>
    <view class="page-container">
        <view class="list-card">
            <view class="list-item" @click="openPopup('nickname')">
                <text class="item-label">昵称</text>
                <view class="item-content">
                    <text class="item-value" :class="{ placeholder: !userInfo.nickname }">{{ userInfo.nickname || '未设置' }}</text>
                    <uni-icons type="right" size="16" color="#AEAEB2"></uni-icons>
                </view>
            </view>
            <view class="list-item" @click="openPopup('gender')">
                <text class="item-label">性别</text>
                <view class="item-content">
                    <text class="item-value" :class="{ placeholder: !userInfo.gender }">{{ userInfo.gender || '未设置' }}</text>
                    <uni-icons type="right" size="16" color="#AEAEB2"></uni-icons>
                </view>
            </view>
            <view class="list-item" @click="openPopup('birthday')">
                <text class="item-label">生日</text>
                <view class="item-content">
                    <text class="item-value" :class="{ placeholder: !userInfo.birthday }">{{ userInfo.birthday || '未设置' }}</text>
                    <uni-icons type="right" size="16" color="#AEAEB2"></uni-icons>
                </view>
            </view>
            <view class="list-item" @click="openPopup('height')">
                <text class="item-label">身高</text>
                <view class="item-content">
                    <text class="item-value" :class="{ placeholder: !userInfo.height }">{{ userInfo.height ? `${userInfo.height}厘米` : '未设置' }}</text>
                    <uni-icons type="right" size="16" color="#AEAEB2"></uni-icons>
                </view>
            </view>
            <view class="list-item" @click="openPopup('weight')">
                <text class="item-label">体重</text>
                <view class="item-content">
                    <text class="item-value" :class="{ placeholder: !userInfo.weight }">{{ userInfo.weight ? `${userInfo.weight}公斤` : '未设置' }}</text>
                    <uni-icons type="right" size="16" color="#AEAEB2"></uni-icons>
                </view>
            </view>
        </view>

        <view class="save-btn-wrapper">
            <button class="save-btn" @click="saveProfile">保 存</button>
        </view>

        <view class="mask" :class="{ show: popup.visible }" @click="closePopup"></view>
        
        <view class="popup-center" :class="{ show: popup.visible && popup.type === 'nickname' }">
            <view class="dialog-content">
                <text class="dialog-title">修改昵称</text>
                <input class="nickname-input" v-model="tempNickname" placeholder="请输入新昵称" :focus="true" />
                <view class="button-group">
                    <button class="btn cancel-btn" @click="closePopup">取消</button>
                    <button class="btn confirm-btn" @click="confirmNickname">确定</button>
                </view>
            </view>
        </view>

        <view class="popup-bottom" :class="{ show: popup.visible && ['gender', 'birthday', 'height', 'weight'].includes(popup.type) }">
            <view v-if="popup.type === 'gender'" class="picker-container">
                <view class="gender-option" @click="selectGender('男')">
                    <text>男</text>
                    <uni-icons v-if="tempGender === '男'" type="checkmarkempty" size="22" color="#FA6400"></uni-icons>
                </view>
                <view class="gender-option" @click="selectGender('女')">
                    <text>女</text>
                    <uni-icons v-if="tempGender === '女'" type="checkmarkempty" size="22" color="#FA6400"></uni-icons>
                </view>
                <view class="gender-cancel" @click="closePopup">取消</view>
            </view>

            <view v-if="['birthday', 'height', 'weight'].includes(popup.type)" class="picker-container">
                <text class="picker-title">{{ popup.title }}</text>
                <picker-view :indicator-style="indicatorStyle" :value="tempValue" @change="handlePickerChange" class="picker-view">
                    <block v-if="popup.type === 'birthday'">
                        <picker-view-column>
                            <view class="item" :class="{ 'selected': index === tempValue[0] }" v-for="(item,index) in years" :key="index">{{item}}年</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view class="item" :class="{ 'selected': index === tempValue[1] }" v-for="(item,index) in months" :key="index">{{item}}月</view>
                        </picker-view-column>
                        <picker-view-column>
                            <view class="item" :class="{ 'selected': index === tempValue[2] }" v-for="(item,index) in days" :key="index">{{item}}日</view>
                        </picker-view-column>
                    </block>
                    <block v-if="popup.type === 'height'">
                        <picker-view-column>
                            <view class="item" :class="{ 'selected': index === tempValue[0] }" v-for="(item, index) in heightRange" :key="index">{{item}} 厘米</view>
                        </picker-view-column>
                    </block>
                    <block v-if="popup.type === 'weight'">
                        <picker-view-column>
                            <view class="item" :class="{ 'selected': index === tempValue[0] }" v-for="(item, index) in weightRange" :key="index">{{item}} 公斤</view>
                        </picker-view-column>
                    </block>
                </picker-view>
                <view class="button-group">
                    <button class="btn cancel-btn" @click="closePopup">取消</button>
                    <button class="btn confirm-btn" @click="confirmSelection">确定</button>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            const date = new Date();
            const years = Array.from({length: 101}, (v, k) => date.getFullYear() - k).reverse();
            const months = Array.from({length: 12}, (v, k) => k + 1);
            const days = Array.from({length: 31}, (v, k) => k + 1);
            return {
                userInfo: { 
                    avatar: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png', 
                    nickname: null, 
                    gender: null, 
                    birthday: null, 
                    height: null, 
                    weight: null 
                },
                // 统一的弹窗状态管理
                popup: {
                    visible: false,
                    type: null,
                    title: ''
                },
                // 临时数据
                tempNickname: '',
                tempGender: '',
                tempValue: [],
                // 选择器数据
                indicatorStyle: `height: 88rpx;`,
                years, 
                months, 
                days,
                genderRange: ['男', '女'],
                heightRange: Array.from({length: 121}, (v, k) => 100 + k),
                weightRange: Array.from({length: 121}, (v, k) => 30 + k),
            }
        },
        computed: {
            // 根据年份和月份动态计算天数
            daysInMonth() {
                if (this.tempValue.length >= 2) {
                    const year = this.years[this.tempValue[0]];
                    const month = this.months[this.tempValue[1]];
                    return new Date(year, month, 0).getDate();
                }
                return 31;
            }
        },
        watch: {
            // 监听年份和月份的变化，动态更新天数
            tempValue: {
                handler(newVal) {
                    if (this.popup.type === 'birthday' && newVal.length >= 2) {
                        const year = this.years[newVal[0]];
                        const month = this.months[newVal[1]];
                        const daysInCurrentMonth = new Date(year, month, 0).getDate();
                        
                        // 更新days数组
                        this.days = Array.from({length: daysInCurrentMonth}, (v, k) => k + 1);
                        
                        // 如果当前选中的日期超过了该月的天数，自动调整到该月最后一天
                        if (newVal[2] >= daysInCurrentMonth) {
                            this.$set(this.tempValue, 2, daysInCurrentMonth - 1);
                        }
                    }
                },
                deep: true
            }
        },
        methods: {
            openPopup(type) {
                this.popup.type = type;
                switch(type) {
                    case 'nickname':
                        this.tempNickname = this.userInfo.nickname;
                        break;
                    case 'gender':
                        this.tempGender = this.userInfo.gender;
                        break;
                    case 'birthday':
                        this.popup.title = '生日';
                        if (this.userInfo.birthday) {
                            let [y, m, d] = this.userInfo.birthday.split('-').map(Number);
                            this.tempValue = [
                                this.years.indexOf(y), 
                                this.months.indexOf(m), 
                                this.days.indexOf(d)
                            ];
                        } else { 
                            // 默认选择2000年1月1日
                            this.tempValue = [
                                this.years.indexOf(2000), 
                                0, // 1月对应索引0
                                0  // 1日对应索引0
                            ]; 
                        }
                        break;
                    case 'height':
                        this.popup.title = '身高';
                        this.tempValue = this.userInfo.height ? [this.heightRange.indexOf(this.userInfo.height)] : [70]; // 默认170cm
                        break;
                    case 'weight':
                        this.popup.title = '体重';
                        this.tempValue = this.userInfo.weight ? [this.weightRange.indexOf(this.userInfo.weight)] : [25]; // 默认55kg
                        break;
                }
                this.popup.visible = true;
            },
            closePopup() {
                this.popup.visible = false;
            },
            confirmNickname() {
                this.userInfo.nickname = this.tempNickname;
                this.closePopup();
            },
            selectGender(gender) {
                this.userInfo.gender = gender;
                this.closePopup();
            },
            handlePickerChange(e) {
                this.tempValue = e.detail.value;
            },
            confirmSelection() {
                switch(this.popup.type) {
                    case 'birthday':
                        const [y, m, d] = [
                            this.years[this.tempValue[0]], 
                            this.months[this.tempValue[1]], 
                            this.days[this.tempValue[2]]
                        ];
                        this.userInfo.birthday = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        break;
                    case 'height':
                        this.userInfo.height = this.heightRange[this.tempValue[0]];
                        break;
                    case 'weight':
                        this.userInfo.weight = this.weightRange[this.tempValue[0]];
                        break;
                }
                this.closePopup();
            },
            saveProfile() {
                uni.showLoading({ title: '保存中...' });
                setTimeout(() => {
                    uni.hideLoading();
                    uni.showToast({ title: '保存成功' });
                    uni.$emit('userInfoUpdated', this.userInfo);
                    setTimeout(() => uni.navigateBack(), 1000);
                }, 500);
            }
        }
    }
</script>

<style scoped>
/* 页面和列表样式 */
.page-container { 
    background-color: #F7F7F7; 
    min-height: 100vh; 
    padding: 24rpx; 
}

.list-card { 
    background-color: #FFFFFF; 
    border-radius: 24rpx; 
    margin-bottom: 24rpx; 
    padding: 0 32rpx; 
}

.list-item { 
    display: flex; 
    justify-content: space-between; 
    align-items: center; 
    padding: 36rpx 0; 
    border-bottom: 1rpx solid #F5F5F5; 
}

.list-item:last-child { 
    border-bottom: none; 
}

.item-label { 
    font-size: 32rpx; 
    color: #1F1F1F; 
}

.item-content { 
    display: flex; 
    align-items: center; 
    color: #8A8A8E; 
}

.item-value { 
    font-size: 30rpx; 
    margin-right: 12rpx; 
}

.item-value.placeholder { 
    color: #C7C7CC; 
}

.avatar { 
    width: 88rpx; 
    height: 88rpx; 
    border-radius: 50%; 
}

/* 遮罩层 */
.mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.4);
    z-index: 998;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
}

.mask.show {
    opacity: 1;
    pointer-events: auto;
}

/* 居中弹窗 (昵称) */
.popup-center {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(1.1);
    width: 600rpx;
    background-color: #fff;
    border-radius: 24rpx;
    z-index: 999;
    opacity: 0;
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
}

.popup-center.show {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    pointer-events: auto;
}

.dialog-content { 
    padding: 40rpx; 
    text-align: center; 
}

.dialog-title { 
    font-size: 34rpx; 
    font-weight: bold; 
    margin-bottom: 30rpx; 
    display: block; 
}

.nickname-input { 
    height: 80rpx; 
    background-color: #F7F7F7; 
    border-radius: 16rpx; 
    padding: 0 24rpx; 
    font-size: 30rpx; 
    text-align: left; 
}

/* 底部弹窗 */
.popup-bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #F7F7F7;
    border-top-left-radius: 32rpx;
    border-top-right-radius: 32rpx;
    z-index: 999;
    transform: translateY(100%);
    transition: transform 0.3s ease-in-out;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    pointer-events: none;
}

.popup-bottom.show {
    transform: translateY(0);
    pointer-events: auto;
}

.picker-container { 
    background-color: #FFFFFF; 
}

.picker-title { 
    font-size: 34rpx; 
    font-weight: bold; 
    text-align: center; 
    padding: 32rpx; 
}

/* 修复picker-view样式 */
.picker-view { 
    width: 100%; 
    height: 440rpx; 
}

.picker-view .item { 
    font-size: 32rpx; 
    line-height: 88rpx; 
    height: 88rpx;
    text-align: center; 
    color: #8A8A8E; 
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
}

.picker-view .item.selected {
    color: #6654e0;
    font-weight: bold;
    font-size: 36rpx;
}

/* 性别选择弹窗 */
.gender-option { 
    background-color: #fff; 
    padding: 32rpx; 
    display: flex; 
    justify-content: center; 
    align-items: center; 
    position: relative; 
    font-size: 32rpx; 
}

.gender-option:first-child { 
    border-bottom: 1rpx solid #F0F0F0; 
}

.gender-option .uni-icons { 
    position: absolute; 
    right: 32rpx; 
}

.gender-cancel { 
    background-color: #fff; 
    margin-top: 16rpx; 
    padding: 32rpx; 
    text-align: center; 
    font-size: 32rpx; 
}

/* 按钮组 */
.button-group { 
    display: flex; 
    padding: 24rpx; 
    background-color: #fff; 
    border-top: 1rpx solid #F5F5F5; 
}

.btn { 
    width: 100%; 
    height: 88rpx; 
    line-height: 88rpx; 
    border-radius: 44rpx; 
    font-size: 30rpx; 
    font-weight: bold; 
    margin: 0 12rpx; 
}

.cancel-btn { 
    background-color: #F0F0F0; 
    color: #1F1F1F; 
}

.confirm-btn { 
    background-color: #6654e0; 
    color: #FFFFFF; 
}

/* 底部保存按钮 */
.save-btn-wrapper { 
    position: fixed; 
    bottom: 0; 
    left: 0; 
    width: 100%; 
    padding: 20rpx 40rpx; 
    padding-bottom: calc(20rpx + env(safe-area-inset-bottom)); 
    background-color: #F7F7F7; 
    box-sizing: border-box; 
}
/*
.save-btn { 
    background-color: #6654e0; 
    color: #fff; 
    border-radius: 50rpx; 
    font-weight: bold; 
}*/
.save-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 44rpx;
    font-size: 32rpx;
    font-weight: bold;
  }

</style>
