# api 文档编写要求
### **api 文档编写参考示例**

***Example cURL request:***

curl -s -X POST \
-H "Authorization: Bearer $REPLICATE_API_TOKEN" \
-H "Content-Type: application/json" \
-H "Prefer: wait" \
-d $'{
"input": {
"prompt": "Make the letters 3D, floating in space on a city street",
"input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
"aspect_ratio": "match_input_image",
"output_format": "jpg",
"safety_tolerance": 2,
"prompt_upsampling": false
}
}' \
https://api.replicate.com/v1/models/black-forest-labs/flux-kontext-max/predictions

***The response will be the version object:***

{
"completed_at": "2025-06-03T21:28:58.602729Z",
"created_at": "2025-06-03T21:28:53.673000Z",
"data_removed": false,
"error": null,
"id": "s5ny1abwn5rma0cq6ysbzw0re8",
"input": {
"prompt": "Make the letters 3D, floating in space on a city street",
"input_image": "https://replicate.delivery/xezq/XfwWjHJ7HfrmXE6ukuLVEpXWfeQ3PQeRI5mApuLXRxST7XMmC/tmpc91tlq20.png",
"aspect_ratio": "match_input_image",
"output_format": "jpg",
"safety_tolerance": 2
},
"logs": "Using seed: 558658691\nGenerating...\nGenerated image in 4.7sec\nDownloading 149928 bytes\nDownloaded 0.14MB in 0.14sec",
"metrics": {
"image_count": 1,
"predict_time": 4.921643012,
"total_time": 4.929729
},
"output": "https://replicate.delivery/xezq/Mbbd8Tx2YfRYXSEmLgblTzGtj4ZurpgPjLui6jAqfXLasRzUA/tmpkav_ivyd.jpg",
"started_at": "2025-06-03T21:28:53.681086Z",
"status": "succeeded",
"urls": {
"stream": "https://stream.replicate.com/v1/files/bcwr-xpekfj5uhysb2iyghdmeoezon5ywfblxkpmvujt6ujnmeobb475a",
"get": "https://api.replicate.com/v1/predictions/s5ny1abwn5rma0cq6ysbzw0re8",
"cancel": "https://api.replicate.com/v1/predictions/s5ny1abwn5rma0cq6ysbzw0re8/cancel"
},
"version": "hidden"
}

**Input schema**

{
"type": "object",
"title": "Input",
"required": [
"prompt"
],
"properties": {
"seed": {
"type": "integer",
"title": "Seed",
"x-order": 4,
"nullable": true,
"description": "Random seed. Set for reproducible generation"
},
"prompt": {
"type": "string",
"title": "Prompt",
"x-order": 0,
"description": "Text description of what you want to generate, or the instruction on how to edit the given image."
},
"input_image": {
"type": "string",
"title": "Input Image",
"format": "uri",
"x-order": 1,
"nullable": true,
"description": "Image to use as reference. Must be jpeg, png, gif, or webp."
},
"aspect_ratio": {
"enum": [
"match_input_image",
"1:1",
"16:9",
"9:16",
"4:3",
"3:4",
"3:2",
"2:3",
"4:5",
"5:4",
"21:9",
"9:21",
"2:1",
"1:2"
],
"type": "string",
"title": "aspect_ratio",
"description": "Aspect ratio of the generated image. Use 'match_input_image' to match the aspect ratio of the input image.",
"default": "match_input_image",
"x-order": 2
},
"output_format": {
"enum": [
"jpg",
"png"
],
"type": "string",
"title": "output_format",
"description": "Output format for the generated image",
"default": "png",
"x-order": 5
},
"safety_tolerance": {
"type": "integer",
"title": "Safety Tolerance",
"default": 2,
"maximum": 6,
"minimum": 0,
"x-order": 6,
"description": "Safety tolerance, 0 is most strict and 6 is most permissive. 2 is currently the maximum allowed when input images are used."
},
"prompt_upsampling": {
"type": "boolean",
"title": "Prompt Upsampling",
"default": false,
"x-order": 3,
"description": "Automatic prompt improvement"
}
}
}

**Output schema**

{
"type": "string",
"title": "Output",
"format": "uri"
}



# api 接口逐一进行校验


### 1. 服务状态管理

- GET /api/v1/status - 获取服务健康状态和系统信息

http://localhost:8787/api/v1/status

`{"success":true,"message":"服务运行正常","data":{"status":"healthy","uptime":1755243221061,"version":"v1","capabilities":{"templates":6,"workflows":2,"features":["content_rendering","ai_workflows","template_system"]}},"meta":{"timestamp":"2025-08-15T07:33:41.061Z","version":"v1"}}`

### 

### 2. 模板管理API

- GET /api/v1/templates - 获取所有可用模板列表
- 

http://localhost:8787/api/v1/templates

`{"success":true,"message":"获取模板列表成功","data":[{"id":"article_wechat","name":"微信医疗文章模板","description":"专为微信公众号设计的医疗文章模板，完全兼容微信编辑器约束","type":"html"},{"id":"tech_analysis_wechat","name":"技术解读模板","description":"专为技术内容解读设计的微信公众号模板，完全兼容微信编辑器约束","type":"html"},{"id":"news_modern_wechat","name":"现代新闻模板","description":"专为新闻资讯设计的微信公众号模板，完全兼容微信编辑器约束","type":"html"},{"id":"github_project_wechat","name":"GitHub项目推荐模板","description":"专为开源项目推荐设计的微信公众号模板，完全兼容微信编辑器约束","type":"html"},{"id":"ai_benchmark_wechat","name":"AI基准测试模板","description":"专为 AI 模型评测设计的微信公众号模板，完全兼容微信编辑器约束","type":"html"},{"id":"professional_analysis_wechat","name":"专业分析模板","description":"专为深度技术分析设计的微信公众号模板，完全兼容微信编辑器约束","type":"html"}],"meta":{"timestamp":"2025-08-15T07:32:22.258Z","version":"v1"}}`

- GET /api/v1/templates/:templateId - 获取特定模板详情

http://localhost:8787/api/v1/templates/:article_wechat

`{"success":false,"error":{"code":"TEMPLATE_NOT_FOUND","message":"模板不存在","details":"模板 :article_wechat 未找到","timestamp":"2025-08-15T07:40:00.710Z"}}`

### 2.0 工作流管理API

- GET /api/v1/workflows - 获取所有工作流列表
- GET /api/v1/workflows/:workflowId - 获取特定工作流详情
- POST /api/v1/workflows/:workflowId/execute - 执行指定工作流
- GET /api/v1/workflows/available - 获取可用工作流列表
- POST /api/v1/workflows/custom - 添加自定义工作流
- DELETE /api/v1/workflows/custom/:workflowId - 删除自定义工作流

- GET /api/v1/workflows - 获取所有工作流列表

http://localhost:8787/api/v1/workflows

`{"success":true,"message":"获取工作流列表成功","data":[{"id":"dify-general","name":"URL内容生成","description":"从URL生成内容（默认）","type":"url","apiKeyEnv":"DIFY_API_KEY","inputFields":["url"],"icon":"ion-md-cloud-download","isDefault":true},{"id":"dify-article","name":"AI文章生成","description":"基于关键词生成文章（默认）","type":"text","apiKeyEnv":"DIFY_ARTICLE_API_KEY","inputFields":["title","style","context"],"icon":"ion-md-create","isDefault":true}],"meta":{"timestamp":"2025-08-15T07:35:36.506Z","version":"v1"}}`

- GET /api/v1/workflows/:workflowId - 获取特定工作流详情

[http://localhost:8787/api/v1/workflows/:](http://localhost:8787/api/v1/workflows/:workflowId)`dify-general`

`{"success":false,"error":{"code":"WORKFLOW_NOT_FOUND","message":"工作流不存在","details":"工作流 :dify-general 未找到","timestamp":"2025-08-15T07:42:12.790Z"}}`

- POST /api/v1/workflows/:workflowId/execute - 执行指定工作流

[http://localhost:8787](http://localhost:8787/api/v1/workflows/:workflowId)/api/v1/workflows/:`dify-general`/execute

`{"success":false,"error":{"code":"ROUTE_NOT_FOUND","message":"路由不存在","details":null,"timestamp":"2025-08-15T07:47:10.986Z"}}`

- GET /api/v1/workflows/available - 获取可用工作流列表

[http://localhost:8787](http://localhost:8787/api/v1/workflows/:workflowId)/api/v1/workflows/available

`{"success":true,"message":"获取可用工作流列表成功","data":[{"id":"dify-general","name":"URL内容生成","description":"从URL生成内容（默认）","type":"url","icon":"ion-md-cloud-download","inputFields":["url"],"isDefault":true,"isCustom":false},{"id":"dify-article","name":"AI文章生成","description":"基于关键词生成文章（默认）","type":"text","icon":"ion-md-create","inputFields":["title","style","context"],"isDefault":true,"isCustom":false},{"id":"translate","name":"智能翻译","description":"多语言智能翻译工作流","type":"url","icon":"ion-md-globe","inputFields":["url","targetLanguage"],"isDefault":false,"isCustom":true},{"id":"summary","name":"内容总结","description":"文档内容智能总结","type":"text","icon":"ion-md-document","inputFields":["title","content","style"],"isDefault":false,"isCustom":true},{"id":"analyze","name":"数据分析","description":"数据分析和报告生成","type":"url","icon":"ion-md-analytics","inputFields":["url"],"isDefault":false,"isCustom":true}],"meta":{"timestamp":"2025-08-15T07:49:07.100Z","version":"v1"}}`

### 4. 内容渲染API

- POST /api/v1/content/render - 使用模板渲染内容

### 5. 内容管理API

- GET /api/v1/content/:contentId - 获取内容详情
- GET /api/v1/content/:contentId/html - 获取内容的HTML格式
- GET /api/v1/content/:contentId/url - 获取内容访问URL
- DELETE /api/v1/content/:contentId - 删除指定内容
- GET /api/v1/content - 获取内容列表（支持分页和过滤）