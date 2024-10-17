import { Button, Col, Drawer, Row } from 'antd';
import ss from './index.less';

const DeptDetail = ({ open, onClose, detail, handleToEdit }) => {
  return (
    <Drawer
      title="科室详情"
      width={560}
      open={open}
      onClose={onClose}
      className={ss.deptDetail}
    >
      <div className={ss.header}>
        <div className={ss.name}>
          {detail?.imageUrl ? (
            <img src={detail?.imageUrl} className={ss.img} />
          ) : null}
          <p>{detail?.name}</p>
        </div>

        <div className={ss.infos}>
          <Row gutter={[0, 16]}>
            <Col span={12}>上级科室：{detail?.parentName ?? '-'}</Col>
            <Col span={12}>科室编码：{detail?.code ?? '-'}</Col>

            <Col span={12}>关联国标：{detail?.standardName ?? '-'}</Col>
            <Col span={12}>咨询电话：{detail?.tel ?? '-'}</Col>
          </Row>
        </div>
      </div>
      <div className={ss.introduction}>
        <p className={ss.intorTitle}>科室介绍</p>
        <div
          dangerouslySetInnerHTML={{
            __html: detail?.summary ?? '无',
          }}
        ></div>
      </div>

      <div className={ss.footer}>
        <Button type="primary" onClick={handleToEdit}>
          编辑
        </Button>
      </div>
    </Drawer>
  );
};

export default DeptDetail;
