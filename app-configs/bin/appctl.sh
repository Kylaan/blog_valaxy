#!/bin/bash
# Valaxy 博客部署控制脚本
# 用于云效 Flow 自动部署

set -e

# 配置变量
APP_NAME="valaxy-blog"
APP_DIR="/www/wwwroot/blog_valaxy"
DIST_DIR="$APP_DIR/dist"
NGINX_CONF="/www/server/panel/vhost/nginx/kylaan.top.conf"
LOG_FILE="$APP_DIR/deploy.log"

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 启动函数（Valaxy 是静态站点，实际上是重新加载 Nginx）
start() {
    log "🚀 启动应用: $APP_NAME"
    
    # 检查 dist 目录是否存在
    if [ ! -d "$DIST_DIR" ]; then
        log "❌ 错误: dist 目录不存在"
        exit 1
    fi
    
    # 测试 Nginx 配置
    log "🔍 测试 Nginx 配置..."
    if ! nginx -t 2>&1 | tee -a "$LOG_FILE"; then
        log "❌ Nginx 配置测试失败"
        exit 1
    fi
    
    # 重新加载 Nginx
    log "🔄 重新加载 Nginx..."
    nginx -s reload
    
    log "✅ 应用启动成功"
}

# 停止函数（对于静态站点，这个是备份当前版本）
stop() {
    log "⏸️  停止应用: $APP_NAME"
    
    # 备份当前版本
    if [ -d "$DIST_DIR" ]; then
        log "📦 备份当前版本..."
        rm -rf "$DIST_DIR.backup"
        cp -r "$DIST_DIR" "$DIST_DIR.backup"
        log "✅ 备份完成: $DIST_DIR.backup"
    fi
}

# 重启函数
restart() {
    log "🔄 重启应用: $APP_NAME"
    stop
    start
}

# 状态检查函数
status() {
    log "📊 检查应用状态: $APP_NAME"
    
    # 检查 dist 目录
    if [ -d "$DIST_DIR" ]; then
        log "✅ dist 目录存在: $DIST_DIR"
        log "📁 文件数量: $(find $DIST_DIR -type f | wc -l)"
    else
        log "❌ dist 目录不存在"
    fi
    
    # 检查 Nginx 状态
    if systemctl is-active --quiet nginx; then
        log "✅ Nginx 运行中"
    else
        log "❌ Nginx 未运行"
    fi
    
    # 显示最近部署时间
    if [ -f "$DIST_DIR/index.html" ]; then
        log "📅 最近更新: $(stat -c %y $DIST_DIR/index.html)"
    fi
}

# 健康检查函数
health() {
    log "🏥 健康检查: $APP_NAME"
    
    # 检查本地访问
    if curl -s -o /dev/null -w "%{http_code}" http://localhost/ | grep -q "200"; then
        log "✅ 本地访问正常 (HTTP 200)"
        return 0
    else
        log "❌ 本地访问失败"
        return 1
    fi
}

# 清理函数
clean() {
    log "🧹 清理旧版本..."
    
    # 删除备份（保留最近的）
    find "$APP_DIR" -name "dist.backup.*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
    
    # 清理日志（保留最近 30 天）
    if [ -f "$LOG_FILE" ]; then
        tail -n 1000 "$LOG_FILE" > "$LOG_FILE.tmp"
        mv "$LOG_FILE.tmp" "$LOG_FILE"
    fi
    
    log "✅ 清理完成"
}

# 回滚函数
rollback() {
    log "⏮️  回滚到上一个版本..."
    
    if [ -d "$DIST_DIR.backup" ]; then
        rm -rf "$DIST_DIR"
        mv "$DIST_DIR.backup" "$DIST_DIR"
        restart
        log "✅ 回滚成功"
    else
        log "❌ 没有可用的备份版本"
        exit 1
    fi
}

# 主函数
main() {
    case "$1" in
        start)
            start
            ;;
        stop)
            stop
            ;;
        restart)
            restart
            ;;
        status)
            status
            ;;
        health)
            health
            ;;
        clean)
            clean
            ;;
        rollback)
            rollback
            ;;
        *)
            echo "用法: $0 {start|stop|restart|status|health|clean|rollback}"
            echo ""
            echo "命令说明:"
            echo "  start    - 启动应用（重新加载 Nginx）"
            echo "  stop     - 停止应用（备份当前版本）"
            echo "  restart  - 重启应用"
            echo "  status   - 查看应用状态"
            echo "  health   - 健康检查"
            echo "  clean    - 清理旧版本"
            echo "  rollback - 回滚到上一个版本"
            exit 1
            ;;
    esac
}

# 执行主函数
main "$@"
