export default{
    // 时间戳转换
    getDateTime(dt, type){
        // 是否传入时间，没有传入的话，用当前时间转换
        let time = dt ? new Date(dt) : new Date();
        let y = time.getFullYear();
        let m = time.getMonth() + 1;
        let d = time.getDate();
        let h = time.getHours();
        let mm = time.getMinutes();
        let s =time.getSeconds();
        let add = (m)=>{
            return m < 10 ? '0' + m : m;
        }

        let datetime;   // 函数返回转换后的时间
        if(type == 'date'){
            // 返回年月日
            datetime = y + '-' + add(m) + '-' + add(d);
        }else{
            // 返回年月日时分秒
            datetime = y + '-' + add(m) + '-' + add(d) + '-' + add(h) + '-' + add(mm) + ':' + add(s);
        }
        return datetime
    }
}