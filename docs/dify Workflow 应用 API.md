Workflow 应用 API
Workflow 应用无会话支持，适合用于翻译/文章写作/总结 AI 等等。

Base URL
Code
https://api.dify.ai/v1

Copy
Copied!
Authentication
Service API 使用 API-Key 进行鉴权。 强烈建议开发者把 API-Key 放在后端存储，而非分享或者放在客户端存储，以免 API-Key 泄露，导致财产损失。 所有 API 请求都应在 Authorization HTTP Header 中包含您的 API-Key，如下所示：

Code
  Authorization: Bearer {API_KEY}


Copy
Copied!
POST
/workflows/run
执行 workflow
执行 workflow，没有已发布的 workflow，不可执行。

Request Body
inputs (object) Required 允许传入 App 定义的各变量值。 inputs 参数包含了多组键值对（Key/Value pairs），每组的键对应一个特定变量，每组的值则是该变量的具体值。变量可以是文件列表类型。 文件列表类型变量适用于传入文件结合文本理解并回答问题，仅当模型支持该类型文件解析能力时可用。如果该变量是文件列表类型，该变量对应的值应是列表格式，其中每个元素应包含以下内容：
type (string) 支持类型：
document 具体类型包含：'TXT', 'MD', 'MARKDOWN', 'PDF', 'HTML', 'XLSX', 'XLS', 'DOCX', 'CSV', 'EML', 'MSG', 'PPTX', 'PPT', 'XML', 'EPUB'
image 具体类型包含：'JPG', 'JPEG', 'PNG', 'GIF', 'WEBP', 'SVG'
audio 具体类型包含：'MP3', 'M4A', 'WAV', 'WEBM', 'AMR'
video 具体类型包含：'MP4', 'MOV', 'MPEG', 'MPGA'
custom 具体类型包含：其他文件类型
transfer_method (string) 传递方式，remote_url 图片地址 / local_file 上传文件
url (string) 图片地址（仅当传递方式为 remote_url 时）
upload_file_id (string) 上传文件 ID（仅当传递方式为 local_file 时）
response_mode (string) Required 返回响应模式，支持：
streaming 流式模式（推荐）。基于 SSE（Server-Sent Events）实现类似打字机输出方式的流式返回。
blocking 阻塞模式，等待执行完毕后返回结果。（请求若流程较长可能会被中断）。 由于 Cloudflare 限制，请求会在 100 秒超时无返回后中断。
user (string) Required 用户标识，用于定义终端用户的身份，方便检索、统计。 由开发者定义规则，需保证用户标识在应用内唯一。API 无法访问 WebApp 创建的会话。
files (array[object]) 可选
trace_id (string) Optional 链路追踪ID。适用于与业务系统已有的trace组件打通，实现端到端分布式追踪等场景。如果未指定，系统将自动生成 trace_id。支持以下三种方式传递，具体优先级依次为：
Header：推荐通过 HTTP Header X-Trace-Id 传递，优先级最高。
Query 参数：通过 URL 查询参数 trace_id 传递。
Request Body：通过请求体字段 trace_id 传递（即本字段）。
Response
当 response_mode 为 blocking 时，返回 CompletionResponse object。 当 response_mode 为 streaming时，返回 ChunkCompletionResponse object 流式序列。

CompletionResponse
返回完整的 App 结果，Content-Type 为 application/json 。

workflow_run_id (string) workflow 执行 ID
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
data (object) 详细内容
id (string) workflow 执行 ID
workflow_id (string) 关联 Workflow ID
status (string) 执行状态, running / succeeded / failed / stopped
outputs (json) Optional 输出内容
error (string) Optional 错误原因
elapsed_time (float) Optional 耗时(s)
total_tokens (int) Optional 总使用 tokens
total_steps (int) 总步数（冗余），默认 0
created_at (timestamp) 开始时间
finished_at (timestamp) 结束时间
ChunkCompletionResponse
返回 App 输出的流式块，Content-Type 为 text/event-stream。 每个流式块均为 data: 开头，块之间以 \n\n 即两个换行符分隔，如下所示：

data: {"event": "text_chunk", "workflow_run_id": "b85e5fc5-751b-454d-b14e-dc5f240b0a31", "task_id": "bd029338-b068-4d34-a331-fc85478922c2", "data": {"text": "\u4e3a\u4e86", "from_variable_selector": ["1745912968134", "text"]}}\n\n

Copy
Copied!
流式块中根据 event 不同，结构也不同，包含以下类型：

event: workflow_started workflow 开始执行
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
workflow_run_id (string) workflow 执行 ID
event (string) 固定为 workflow_started
data (object) 详细内容
id (string) workflow 执行 ID
workflow_id (string) 关联 Workflow ID
created_at (timestamp) 开始时间
event: node_started node 开始执行
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
workflow_run_id (string) workflow 执行 ID
event (string) 固定为 node_started
data (object) 详细内容
id (string) workflow 执行 ID
node_id (string) 节点 ID
node_type (string) 节点类型
title (string) 节点名称
index (int) 执行序号，用于展示 Tracing Node 顺序
predecessor_node_id (string) 前置节点 ID，用于画布展示执行路径
inputs (object) 节点中所有使用到的前置节点变量内容
created_at (timestamp) 开始时间
event: text_chunk 文本片段
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
workflow_run_id (string) workflow 执行 ID
event (string) 固定为 text_chunk
data (object) 详细内容
text (string) 文本内容
from_variable_selector (array) 文本来源路径，帮助开发者了解文本是由哪个节点的哪个变量生成的
event: node_finished node 执行结束，成功失败同一事件中不同状态
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
workflow_run_id (string) workflow 执行 ID
event (string) 固定为 node_finished
data (object) 详细内容
id (string) node 执行 ID
node_id (string) 节点 ID
index (int) 执行序号，用于展示 Tracing Node 顺序
predecessor_node_id (string) optional 前置节点 ID，用于画布展示执行路径
inputs (object) 节点中所有使用到的前置节点变量内容
process_data (json) Optional 节点过程数据
outputs (json) Optional 输出内容
status (string) 执行状态 running / succeeded / failed / stopped
error (string) Optional 错误原因
elapsed_time (float) Optional 耗时(s)
execution_metadata (json) 元数据
total_tokens (int) optional 总使用 tokens
total_price (decimal) optional 总费用
currency (string) optional 货币，如 USD / RMB
created_at (timestamp) 开始时间
event: workflow_finished workflow 执行结束，成功失败同一事件中不同状态
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
workflow_run_id (string) workflow 执行 ID
event (string) 固定为 workflow_finished
data (object) 详细内容
id (string) workflow 执行 ID
workflow_id (string) 关联 Workflow ID
status (string) 执行状态 running / succeeded / failed / stopped
outputs (json) Optional 输出内容
error (string) Optional 错误原因
elapsed_time (float) Optional 耗时(s)
total_tokens (int) Optional 总使用 tokens
total_steps (int) 总步数（冗余），默认 0
created_at (timestamp) 开始时间
finished_at (timestamp) 结束时间
event: tts_message TTS 音频流事件，即：语音合成输出。内容是Mp3格式的音频块，使用 base64 编码后的字符串，播放的时候直接解码即可。(开启自动播放才有此消息)
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
message_id (string) 消息唯一 ID
audio (string) 语音合成之后的音频块使用 Base64 编码之后的文本内容，播放的时候直接 base64 解码送入播放器即可
created_at (int) 创建时间戳，如：1705395332
event: tts_message_end TTS 音频流结束事件，收到这个事件表示音频流返回结束。
task_id (string) 任务 ID，用于请求跟踪和下方的停止响应接口
message_id (string) 消息唯一 ID
audio (string) 结束事件是没有音频的，所以这里是空字符串
created_at (int) 创建时间戳，如：1705395332
event: ping 每 10s 一次的 ping 事件，保持连接存活。
Errors
400，invalid_param，传入参数异常
400，app_unavailable，App 配置不可用
400，provider_not_initialize，无可用模型凭据配置
400，provider_quota_exceeded，模型调用额度不足
400，model_currently_not_support，当前模型不可用
400，workflow_request_error，workflow 执行失败
500，服务内部异常




curl -X POST 'https://api.dify.ai/v1/workflows/run' \
--header 'Authorization: Bearer {api_key}' \
--header 'Content-Type: application/json' \
--data-raw '{
    "inputs": {},
    "response_mode": "streaming",
    "user": "abc-123"
}'




{
  "inputs": {
    "{variable_name}": 
    [
      {
      "transfer_method": "local_file",
      "upload_file_id": "{upload_file_id}",
      "type": "{document_type}"
      }
    ]
  }
}



Blocking Mode

{
    "workflow_run_id": "djflajgkldjgd",
    "task_id": "9da23599-e713-473b-982c-4328d4f5c78a",
    "data": {
        "id": "fdlsjfjejkghjda",
        "workflow_id": "fldjaslkfjlsda",
        "status": "succeeded",
        "outputs": {
          "text": "Nice to meet you."
        },
        "error": null,
        "elapsed_time": 0.875,
        "total_tokens": 3562,
        "total_steps": 8,
        "created_at": 1705407629,
        "finished_at": 1727807631
    }
}



Streaming Mode

  data: {"event": "workflow_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "created_at": 1679586595}}
  data: {"event": "node_started", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "created_at": 1679586595}}
  data: {"event": "node_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "node_id": "dfjasklfjdslag", "node_type": "start", "title": "Start", "index": 0, "predecessor_node_id": "fdljewklfklgejlglsd", "inputs": {}, "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "execution_metadata": {"total_tokens": 63127864, "total_price": 2.378, "currency": "USD"},  "created_at": 1679586595}}
  data: {"event": "workflow_finished", "task_id": "5ad4cb98-f0c7-4085-b384-88c403be6290", "workflow_run_id": "5ad498-f0c7-4085-b384-88cbe6290", "data": {"id": "5ad498-f0c7-4085-b384-88cbe6290", "workflow_id": "dfjasklfjdslag", "outputs": {}, "status": "succeeded", "elapsed_time": 0.324, "total_tokens": 63127864, "total_steps": "1", "created_at": 1679586595, "finished_at": 1679976595}}
  data: {"event": "tts_message", "conversation_id": "23dd85f3-1a41-4ea0-b7a9-062734ccfaf9", "message_id": "a8bdc41c-13b2-4c18-bfd9-054b9803038c", "created_at": 1721205487, "task_id": "3bf8a0bb-e73b-4690-9e66-4e429bad8ee7", "audio": "qqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"}
  data: {"event": "tts_message_end", "conversation_id": "23dd85f3-1a41-4ea0-b7a9-062734ccfaf9", "message_id": "a8bdc41c-13b2-4c18-bfd9-054b9803038c", "created_at": 1721205487, "task_id": "3bf8a0bb-e73b-4690-9e66-4e429bad8ee7", "audio": ""}




gET
/workflows/logs
获取 workflow 日志
倒序返回 workflow 日志

Query
Name
keyword
Type
string
Description
关键字

Name
status
Type
string
Description
执行状态 succeeded/failed/stopped

Name
page
Type
int
Description
当前页码, 默认1.

Name
limit
Type
int
Description
每页条数, 默认20.

Name
created_by_end_user_session_id
Type
str
Description
由哪个endUser创建，例如，abc-123.

Name
created_by_account
Type
str
Description
由哪个邮箱账户创建，例如，lizb@test.com.

Response
page (int) 当前页码
limit (int) 每页条数
total (int) 总条数
has_more (bool) 是否还有更多数据
data (array[object]) 当前页码的数据
id (string) 标识
workflow_run (object) Workflow 执行日志
id (string) 标识
version (string) 版本
status (string) 执行状态，running / succeeded / failed / stopped
error (string) (可选) 错误
elapsed_time (float) 耗时，单位秒
total_tokens (int) 消耗的 token 数量
total_steps (int) 执行步骤长度
created_at (timestamp) 开始时间
finished_at (timestamp) 结束时间
created_from (string) 来源
created_by_role (string) 角色
created_by_account (string) (可选) 帐号
created_by_end_user (object) 用户
id (string) 标识
type (string) 类型
is_anonymous (bool) 是否匿名
session_id (string) 会话标识
created_at (timestamp) 创建时间


curl -X GET 'https://api.dify.ai/v1/workflows/logs'\
 --header 'Authorization: Bearer {api_key}'



{
    "page": 1,
    "limit": 1,
    "total": 7,
    "has_more": true,
    "data": [
        {
            "id": "e41b93f1-7ca2-40fd-b3a8-999aeb499cc0",
            "workflow_run": {
                "id": "c0640fc8-03ef-4481-a96c-8a13b732a36e",
                "version": "2024-08-01 12:17:09.771832",
                "status": "succeeded",
                "error": null,
                "elapsed_time": 1.3588523610014818,
                "total_tokens": 0,
                "total_steps": 3,
                "created_at": 1726139643,
                "finished_at": 1726139644
            },
            "created_from": "service-api",
            "created_by_role": "end_user",
            "created_by_account": null,
            "created_by_end_user": {
                "id": "7f7d9117-dd9d-441d-8970-87e5e7e687a3",
                "type": "service_api",
                "is_anonymous": false,
                "session_id": "abc-123"
            },
            "created_at": 1726139644
        }
    ]
}






