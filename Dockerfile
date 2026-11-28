FROM cgr.dev/chainguard/nginx:latest@sha256:07295c9284f8db3f8ed77b74ee8ee5284e4372e05851aa2288bcbc881ebf8acf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html

EXPOSE 3000
