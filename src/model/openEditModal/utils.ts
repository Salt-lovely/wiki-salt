import { isString } from 'salt-lib'

const errorReason: Record<string, string> = {
  'moderation-edit-queued': '等待版主审核',
}
export function getEditErrorMsg(error: unknown) {
  if (isString(error)) {
    return errorReason[error] || error
  }
  if (error instanceof Error) {
    return (
      errorReason[error.name] ||
      errorReason[error.message] ||
      error.message ||
      error.name ||
      '未知错误，更多信息请见检查控制台'
    )
  }
  // if(Boolean(error && error.toString)){
  //   return error.toString()
  // }
  return '未知错误，更多信息请见检查控制台'
}
