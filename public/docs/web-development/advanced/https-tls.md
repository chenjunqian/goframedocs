# HTTPS & TLS

## HTTPS Service

Establishing an `HTTPS` service is straightforward using the `EnableHTTPS(certFile, keyFile string)` method provided by the framework's WebServer. Clearly, this method requires two parameters: the certificate file and the corresponding private key file for `HTTPS` asymmetric encryption.

### Preparation

For local demonstration purposes, we can use the `openssl` command to generate a local certificate and the corresponding private key file for testing. The commands are as follows:

Generate a private key file using the common `RSA` algorithm:

```bash
openssl genrsa -out server.key 2048
```

Additionally, we can use the `ECDSA` algorithm to generate a private key file:

```bash
openssl ecparam -genkey -name secp384r1 -out server.key
```

Generate a certificate file based on the private key file:

```bash
openssl req -new -x509 -key server.key -out server.crt -days 365
```

(Optionally) Generate a public key file from the private key, which is used for client-server communication:

```bash
openssl rsa -in server.key -out server.key.public
```

`OpenSSL` supports a variety of algorithms and command arguments. For a deeper understanding, use the `man openssl` command to view details. The process of generating related private keys, public keys, and certificate files in the local environment (`Ubuntu`) using commands is as follows:

```bash
$ openssl genrsa -out server.key 2048
Generating RSA private key, 2048 bit long modulus
.........................+++
.....................................................................+++
unable to write 'random state'
e is 65537 (0x10001)

$ openssl req -new -x509 -key server.key -out server.crt -days 365
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:CH
State or Province Name (full name) [Some-State]:SiChuan
Locality Name (eg, city) []:Chengdu
Organization Name (eg, company) [Internet Widgits Pty Ltd]:John.cn
Organizational Unit Name (eg, section) []:Dev
Common Name (e.g. server FQDN or YOUR name) []:John
Email Address []:john@johng.cn

$ openssl rsa -in server.key -out server.key.public
writing RSA key

$ ll
total 20
drwxrwxr-x  2 john john 4096 Apr 23 21:26 ./
drwxr-xr-x 90 john john 4096 Apr 23 20:55 ../
-rw-rw-r--  1 john john 1383 Apr 23 21:26 server.crt
-rw-rw-r--  1 john john 1675 Apr 23 21:25 server.key
-rw-rw-r--  1 john john 1675 Apr 23 21:26 server.key.public
```

In the certificate generation command, you are prompted to enter some information, which can be left blank by pressing enter. We filled in some information arbitrarily here.

### Example Code

Based on the generated private key and certificate files, let's demonstrate how to implement an HTTPS service using `ghttp.Server`. The example code is as follows:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := ghttp.GetServer()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("From HTTPS Hello World!")
    })
    s.EnableHTTPS("/home/john/https/server.crt", "/home/john/https/server.key")
    s.SetPort(8199)
    s.Run()
}
```

You can see that we simply pass the addresses of the previously generated certificate and private key files to `EnableHTTPS`. We set the HTTPS service port through `s.SetPort(8199)`. Of course, we can also achieve this with `s.SetHTTPSPort(8199)`. There is no difference between the two in a single service. However, when the WebServer needs to support both HTTP and HTTPS services, the roles of the two differ, a feature we will introduce later. Subsequently, we visit the page [https://127.0.0.1:8199/](https://127.0.0.1:8199/) to see the effect.

## HTTPS and HTTP Support

We often encounter situations where we need to provide the same service through `HTTP` and `HTTPS`, that is, everything is the same except for the port and access protocol. If we were to use the traditional method of running multiple WebServers, it would be quite cumbersome. To easily solve developers' troubles, `ghttp` provides a very convenient feature: supporting "the same" `WebServer` to simultaneously support `HTTPS` and `HTTP` access protocols. Let's look at an example:

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := ghttp.GetServer()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("You can view this content on both HTTP and HTTPS!")
    })
    s.EnableHTTPS("/home/john/https/server.crt", "/home/john/https/server.key")
    s.SetHTTPSPort(443)
    s.SetPort(80)
    s.Run()
}
```

After execution, accessing these two addresses [http://127.0.0.1/](http://127.0.0.1/) and [https://127.0.0.1/](https://127.0.0.1/) through the local browser will show the same content (note that due to some system permission restrictions, the WebServer binding to ports `80` and `443` requires `root/administrator` privileges. If there is an error when starting, you can change the port number and execute it again).

In this example, we used two methods to enable HTTPS features:

```go
func (s *Server) EnableHTTPS(certFile, keyFile string) error
func (s *Server) SetHTTPSPort(port ...int) error
```

One is to add the certificate and key files, and the other is to set the HTTPS protocol listening port. Once these two properties are set, the WebServer will enable the HTTPS feature. Moreover, in the example, we also set the HTTP service listening port through the `SetPort` method, so the WebServer will simultaneously listen to the specified HTTPS and HTTP service ports.

## Using Let's Encrypt Free Certificates

There are many `SSL` free certificate authorities, such as:

- `Tencent` Cloud DV SSL Certificate: [https://cloud.tencent.com/product/ssl](https://cloud.tencent.com/product/ssl)
- `Let's Encrypt`: [https://letsencrypt.org/](https://letsencrypt.org/)
- `CloudFlare` SSL: [https://www.cloudflare.com/](https://www.cloudflare.com/)
- `StartSSL`: [https://www.startcomca.com/](https://www.startcomca.com/)
- `Wosign` SSL: [https://www.wosign.com/](https://www.wosign.com/)
- loovit.net `AlphaSSL`: [https://www.lowendtalk.com/entry/register?Target=discussion%2Fcomment%2F2306096](https://www.lowendtalk.com/entry/register?Target=discussion%2Fcomment%2F2306096)

The following uses `Let's Encrypt` as an example to introduce how to apply for, use, and renew free certificates.

`Let's Encrypt` official website: [https://letsencrypt.org/](https://letsencrypt.org/)

The following uses the Ubuntu system as an example to explain how to apply for `Let's Encrypt` free certificates and use them within the `GoFrame` framework.

### Installing Certbot

Certbot official website: [https://certbot.eff.org/](https://certbot.eff.org/)

To apply for `Let's Encrypt` free certificates, you need to use the `certbot` tool:

```bash
sudo apt-get update
sudo apt-get install software-properties-common
sudo add-apt-repository ppa:certbot/certbot
sudo apt-get update
sudo apt-get install certbot
```

### Applying for Certificates

Use the following command:

```bash
bash
certbot certonly --standalone -d your-domain --staple-ocsp -m your-email --agree-tos
```

For example:

```bash
root@ip-172-31-41-204:~# certbot certonly --standalone -d goframe.org --staple-ocsp -m john@goframe.org --agree-tos
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Plugins selected: Authenticator standalone, Installer None
Starting new HTTPS connection (1): acme-v02.api.letsencrypt.org
Obtaining a new certificate
Performing the following challenges:
http-01 challenge for goframe.org
Waiting for verification...
Cleaning up challenges
```

IMPORTANT NOTES:

- Congratulations! Your certificate and chain have been saved at:
  `/etc/letsencrypt/live/goframe.org/fullchain.pem`
  Your key file has been saved at:
  `/etc/letsencrypt/live/goframe.org/privkey.pem`
  Your cert will expire on 2019-01-25. To obtain a new or tweaked
  version of this certificate in the future, simply run certbot
  again. To non-interactively renew *all* of your certificates, run
  "certbot renew"
- If you like Certbot, please consider supporting our work by:

  Donating to ISRG / Let's Encrypt: [https://letsencrypt.org/donate](https://letsencrypt.org/donate)
  Donating to EFF: [https://eff.org/donate-le](https://eff.org/donate-le)

By default, the certificate will be installed in `/etc/letsencrypt/`, and the certificate and private key files are respectively:

`/etc/letsencrypt/live/goframe.org/fullchain.pem`
`/etc/letsencrypt/live/goframe.org/privkey.pem`

### Using Certificates

```go
package main

import (
    "github.com/gogf/gf/v2/net/ghttp"
)

func main() {
    s := ghttp.GetServer()
    s.BindHandler("/", func(r *ghttp.Request){
        r.Response.Writeln("来自于HTTPS的：哈喽世界！")
    })
    s.EnableHTTPS("/etc/letsencrypt/live/goframe.org/fullchain.pem", "/etc/letsencrypt/live/goframe.org/privkey.pem")
    s.Run()
}
```

### Certificate Renewal

The certificate's default validity period is `3 months`, and it needs to be manually renewed upon expiration. Use the following command:

```bash
certbot renew
```

Example 1, we can use a `crontab` scheduled task to automatically renew:

```bash
# Try to renew once a day, and restart the `GoFrame` framework's WebServer after success
0 3 * * * certbot renew --quiet --renew-hook "kill -SIGUSR1 $(pidof 进程名称)"
```

Example 2, if we manage certificates through `nginx`, we can set up a scheduled task like this:

```bash
# Try to renew once a day, and the certificate renewal requires closing the WebServer listening on port 80 first
0 3 * * * service nginx stop && certbot renew --quiet --renew-hook "service nginx start"
```

To prevent the potential failure of the `certbot renew` command from causing `nginx` from restarting, for stability, you can do the following:

```bash
# Try to renew once a day, and the certificate renewal requires closing the WebServer listening on port 80 first
0 3 * * * service nginx stop && certbot renew --quiet --renew-hook "service nginx start"
5 3 * * * service nginx start
```
